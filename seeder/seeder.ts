import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import { bgBlue, gray, green, rainbow, yellow } from 'colors'
import { getAverageColor } from 'fast-average-color-node'
import * as process from 'process'
import prompts from 'prompts'
import puppeteer from 'puppeteer-extra'
import { removeEmoji } from '../src/utils/removeEmoji'
import { customLinkSelect } from './aditionalFunc'
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
	const selectGenres = [
		"Fantasy",
		"Young Adult",
		"Fiction",
		"Adventure",
		"Classics",
		"School",
		"Historical",
		"Romance",
		"Adult",
		"War",
		"Philosophy",
		"Thriller"
	]
	const books = JSON.parse(JSON.stringify(
		// JsonBooks
		[]
	))
	const lastBook = await prisma.book.findFirst({
		orderBy: {
			id: 'desc'
		},
		take: 1,
		select: {
		id: true,
		description: true,
		}
	}) || { id: 0, description: '' }
	const lastBookIndex = books.findIndex((book) => book.description === lastBook.description)
	console.log(rainbow(`Last book index: ${lastBookIndex}`))
	books.filter((book: Book) => book.language === 'English')
		.slice(lastBookIndex + 1, 1000).sort((a: Book, b: Book) => b.numRatings - a.numRatings).filter((book: Book) => book.numRatings > 20000)
	const browser = await puppeteer.launch({
		headless: false,
	  args: [
			'--headless',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-sandbox',
			'--disable-canvas-aa', // Disable antialiasing on 2d canvas
			'--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
			'--disable-dev-shm-usage', // ???
			'--no-zygote', // wtf does that mean ?
			'--use-gl=swiftshader', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
			'--enable-webgl',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-first-run',
			'--disable-infobars',
			'--disable-breakpad',
			'--window-size=1280,1024',
			'--user-data-dir=./chromeData',
			'--no-sandbox',
			'--disable-setuid-sandbox'],
		
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions'],
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
	for (let i = lastBookIndex + 1; i < books.length; i++) {
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
				if (book.numRatings < 200000) return console.log(yellow(`❌ No result for ${book.title}`))
			const customLink =	customLinkSelect({
				title: book.title, author: book.author.replace(/,.*|\(.*?\)/g, '').trim()})
			if (!customLink) return
		})
			if ((typeof epub === 'string' && !epub) || !epub.link) continue
			
			const epubFile = await fetch(typeof epub === 'string' ? epub : epub.link)
			const imageFile = await fetch(typeof epub === 'string' ? book.coverImg : epub.picture)
			const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
			const epubBuffer = Buffer.from(await epubFile.arrayBuffer())
			
			const s3 = new S3Client({
				endpoint: process.env.AWS_ENDPOINT,
				region: process.env.AWS_REGION,
				credentials: {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
				}
			})
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.AWS_BUCKET,
					Key: `epubs/${typeof epub === 'string' ? book.title : epub.title}.epub`,
					Body: epubBuffer,
					ACL: 'public-read',
					ContentType: 'application/epub+zip',
					ContentDisposition: 'inline'
				})
			)
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.AWS_BUCKET,
					Key: `books-covers/${typeof epub === 'string' ? book.title : epub.title}.jpg`,
					Body: imageBuffer,
					ACL: 'public-read',
					ContentDisposition: 'inline'
				})
			)
			const allGenres = await prisma.genre.findMany({ select: { name: true }, orderBy: {
				books: {
					// eslint-disable-next-line
					_count: 'desc'
				}
				} }).then((genres) => genres.map((genre) => genre.name))
	  const genreWithEmoji: string[] = []
			for (const genre of book.genres.split(',').map((genre) => genre.replace(/[\[\]']/g, '').trim()).filter((genre) => !allGenres.map((genre) => removeEmoji(genre).trim()
			).includes(genre
			)).filter((genre) => selectGenres.includes(genre))) {
						const selectGenre = await prompts({
							type: 'text',
							name: 'value',
							message: `Select emoji for ${genre}:`,
							validate: (value) =>  allGenres.includes(value) ? `Genre ${value} already exists` : true
							
						})
			 selectGenre &&	genreWithEmoji.push(`${selectGenre.value} ${genre.replace(/[\[\]']/g, '').trim()}`)
			}

			const filteredGenres = book.genres.split(',').map((genre) => genre.replace(/[\[\]']/g, '').trim()).filter((genre) => selectGenres.includes(genre));
			const BookGenres = await prisma.genre.findMany({
				select: { name: true, majorBooks: true },
				where: {
					OR: filteredGenres.map(genre => ({ name: { contains: genre } }))
				}
			});
		 console.log(
			 bgBlue('Major genre: ')
			 ,
			 BookGenres.
		 sort((a, b) => a.majorBooks.length - b.majorBooks.length)[0].name
		  ? BookGenres.sort((a, b) => a.majorBooks.length - b.majorBooks.length)[0].name : genreWithEmoji[Math.floor(Math.random() * genreWithEmoji.length)],
			 bgBlue('Genres: '), BookGenres. sort((a, b) => a.majorBooks.length - b.majorBooks.length).map((genre) =>
				 genre.name
			 ).join(', ')
			 ,
		 )
const randomMajorGenre =
	BookGenres.length > 0 ? BookGenres.
		sort((a, b) => a.majorBooks.length - b.majorBooks.length)[0].name :
	genreWithEmoji[Math.floor(Math.random() * genreWithEmoji.length)]
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
								 name: randomMajorGenre
								},
								create: {
									name: randomMajorGenre
								}
							}
					},
					genres: {
						connectOrCreate: [
							...BookGenres.map((genre) => genre.name),
							...genreWithEmoji.map((genre) => genre.replace(/[\[\]']/g, '').trim())
						]
							.map((genre) => ({
							where: {
								name: genre
							},
							create: {
								name: genre
							}
						}))
					},
				image: `books-covers/${
					typeof epub === 'string' ? book.title : epub.title
				}.jpg`,
				pages: typeof epub === 'string' || !epub.pages ? Number(book.pages) : Number(epub.pages),
				likedPercent: book.likedPercent,
				epub: `epubs/${
					typeof epub === 'string' ? book.title : epub.title
				}.epub`,
					},
				})
			console.log(green(`✅ ${i}: ${
				typeof epub === 'string' ? book.title : epub.title
			} by ${book.author.replace(/,.*|\(.*?\)/g, '').trim()}`))
		} catch (error) {
	
		}
	}
	await browser.close()

}

seeder().then((value) => {
	console.log(value)
	process.exit(0)
})




