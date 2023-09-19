import { PrismaClient } from '@prisma/client'
import { bgRed, gray, green, rainbow, yellow } from 'colors'
import { getAverageColor } from 'fast-average-color-node'
import * as process from 'process'
import prompts from 'prompts'
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import { removeEmoji } from '../src/utils/removeEmoji'
import { customLinkSelect } from './aditionalFunc'
import JsonBooks from './books_1.Best_Books_Ever.json'
import { getEpubFromBook } from './getEpubFromBook'

interface Book {
	bookId: string
	title: string
	series: string
	author: string
	rating: number
	description: string
	language: string
	isbn: string
	genres: string
	characters: string
	bookFormat: string
	edition: string
	pages: string
	publisher: string
	publishDate: string
	firstPublishDate: string
	awards: string
	numRatings: number
	ratingsByStars: string
	likedPercent: number
	setting: string
	coverImg: string
	bbeScore: number
	bbeVotes: number
	price: string
}
const prisma = new PrismaClient()
export const seeder = async () => {
	const trashGenres = [
		"Read For School",
		"Literature",
		"Audiobook",
		"Middle Grade",
		"Science Fiction Fantasy",
		"High School",
		"Plays",
		"Russia",
		"19th Century",
		"Russian Literature",
		"LGBT",
		"Mental Health",
		"Contemporary",
		"Historical Fiction",
		"American",
		"Paranormal",
		"Adult Fiction",
		"Chick Lit",
		"Book Club",
		
		
	]
	const books = JSON.parse(JSON.stringify(
		JsonBooks
	))
	const lastBook = await prisma.book.findFirst({
		orderBy: {
			id: 'desc'
		},
		take: 1,
		select: {
			id: true
		}
	}) || { id: 0 }
	console.log(rainbow(`Last book index: ${lastBook.id}`))
	books.filter((book: Book) => book.language === 'English')
		.slice(lastBook.id + 1, 1000).sort((a: Book, b: Book) => b.numRatings - a.numRatings).filter((book: Book) => book.numRatings > 20000)
	const adblocker = AdblockerPlugin({
		blockTrackers: true,
	})
	puppeteer.use(adblocker)
	const browser = await puppeteer.launch({
		headless: false,
		ignoreHTTPSErrors: true
	})
	const page = await browser.newPage()
	await page.setRequestInterception(true)
	page.on('request', req => {
		if (req.resourceType() == 'image') {
			req.abort()
		} else {
			req.continue()
		}
	})
	for (let i = lastBook.id + 1; i < books.length; i++) {
		const book = books[i]
		try {
			const oldBook = await prisma.book.findFirst({
				where: {
					title: book.title,
				}
			})
			if (oldBook) {
				console.log(
						gray(`⚠️ ${book.title} by ${book.author} already exists`))
				continue
			}
		const epub: string | {
			title :string,
			author: string,
			link: string,
			isbn: string | null,
			picture: string,
			pages: number | null,
		} = await getEpubFromBook(
			book.title, book.author.replace(/,.*|\(.*?\)/g, '').trim(), Number(book.pages),	book.numRatings, page).catch((reason) => {
				console.log(bgRed(reason))
				if (book.numRatings < 100000) return console.log(yellow(`❌ No result for ${book.title}`))
			const customLink =	customLinkSelect({
				title: book.title, author: book.author.replace(/,.*|\(.*?\)/g, '').trim()})
			if (!customLink) return
		})
			if ((typeof epub === 'string' && !epub) || !epub.link) continue
	
			// const epubFile = await fetch(epub)
			// const arrayBuffer = await epubFile.arrayBuffer()
			// const epubBuffer = Buffer.from(arrayBuffer)
			//
			// const s3 =  new S3Client({
			// 	region: 'eu-north-1',
			// 	credentials: {
			// 		accessKeyId: process.env.AWS_ACCESS_KEY,
			// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			// 	}
			// })
			// await s3.send(
			// 	new PutObjectCommand({
			// 		Bucket: process.env.AWS_BUCKET,
			// 		Key: `epub/${book.title}.epub`,
			// 		Body: epubBuffer,
			// 		ACL: 'public-read',
			// 		ContentType: 'application/epub+zip' ,
			// 		ContentDisposition: 'inline'
			// 	})
			// )
			// Сделать выбор emoji для всех жанров
			const allGenres = await prisma.genre.findMany({ select: { name: true } }).then((genres) => genres.map((genre) => genre.name))
	  const genreWithEmoji = []
			for (const genre of book.genres.split(',').map((genre) => genre.replace(/[\[\]']/g, '').trim()).filter((genre) => !allGenres.map((genre) => removeEmoji(genre).trim()
			).includes(genre
			)).filter((genre) => !trashGenres.includes(genre))) {
						const selectGenre = await prompts({
							type: 'text',
							name: 'value',
							message: `Select emoji for ${genre}:`,
							validate: (value) =>  allGenres.includes(value) ? `Genre ${value} already exists` : true
							
						})
				if (!selectGenre.value) {
					trashGenres.push(genre)
					continue
				}
			 selectGenre &&	genreWithEmoji.push(`${selectGenre.value} ${genre.replace(/[\[\]']/g, '').trim()}`)
			}

			const filteredGenres = book.genres.split(',').map((genre) => genre.replace(/[\[\]']/g, '').trim()).filter((genre) => !trashGenres.includes(genre));
			const majorGenres = await prisma.genre.findMany({
				select: { name: true },
				where: {
					OR: filteredGenres.map(genre => ({ name: { contains: genre } }))
				}
			});

			const selectMajorGenre = await prompts({
				type: 'select',
				name: 'value',
				message: `Select major genre for ${book.title}:`,
				choices:
					[
						...genreWithEmoji,
					...majorGenres.map((genre) => genre.name)
					]
				.map((genre) => ({
					title: genre,
					value: genre
				})),
			})

			await prisma.book.create({
				data: {
				title: typeof epub === 'string' ? book.title : epub.title,
				author: typeof epub === 'string' ? book.author.replace(/,.*|\(.*?\)/g, '').trim() : epub.author,
				description: book.description,
				popularity: book.numRatings,
				isbn: typeof epub === 'string' || !epub.isbn ? book.isbn : epub.isbn,
				color: await  getAverageColor(book.coverImg).then((color) => color.hex),
					majorGenre: {
							connectOrCreate: {
								where: {
								 name: await  selectMajorGenre.value,
								},
								create: {
									name: await selectMajorGenre.value,
								}
							}
					},
					genres: {
						connectOrCreate: genreWithEmoji.map((genre) => {
							return {
								where: { name: genre.replace(/[\[\]']/g, '').trim()  },
								create: { name: genre.replace(/[\[\]']/g, '').trim()},
							};
						}),
					},
				image: typeof epub === 'string' ? book.coverImg : epub.picture,
				pages: typeof epub === 'string' || !epub.pages ? book.pages : epub.pages,
				likedPercent: book.likedPercent,
				epub: typeof epub === 'string' ? epub : epub.link,
					},
				})
			console.log(green(`✅ ${i}: ${book.title} by ${book.author.replace(/,.*|\(.*?\)/g, '').trim()}`))
		} catch (error) {
			console.error(
				`❌ Failed to generate ePub for ${book.title} by ${book.author}: ${error.message}`
			)
		}
	}
	await browser.close()
return trashGenres
}

seeder().then((value) => {
	console.log(value)
	process.exit(0)
})




