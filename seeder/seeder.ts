import { PrismaClient } from '@prisma/client'
import { gray, green, rainbow } from 'colors'
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import randomColor from 'randomcolor'
// import JsonBooks from './books_1.Best_Books_Ever.json'
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
		const epub = await getEpubFromBook(
			book.title, book.author.replace(/,.*|\(.*?\)/g, '').trim(), 	book.numRatings, page).catch((error) => {
				return console.error(
					`❌ Failed to generate ePub for ${book.title} by ${book.author}: ${error.message}`
				)
		})
			if (typeof epub !== 'string') {
				continue
			}
			const  rared = book.numRatings < 30000 ? 'Common' : book.numRatings < 60000 ? 'Uncommon' : book.numRatings < 100000 ? 'Rare' : book.numRatings < 300000 ? 'Very Rare' : book.numRatings < 500000 ? 'Limited' : book.numRatings < 1000000 ? 'Exquisite' : book.numRatings < 1500000 ? 'Mythic' : book.numRatings < 2500000 ? 'Precious' : book.numRatings < 3500000 ? 'Priceless' : book.numRatings < 5000000 ? 'Antiquarian' : 'Relic'
			
			const price =  book.numRatings < 30000 ? 20 : book.numRatings < 60000 ? 50 : book.numRatings < 100000 ? 100 : book.numRatings < 300000 ? 250 : book.numRatings < 500000 ? 500 : book.numRatings < 1000000 ? 700 : book.numRatings < 1500000 ? 1000 : book.numRatings < 2500000 ? 2000 : book.numRatings < 3500000 ? 3500 : book.numRatings < 4500000 ? 5000 : 8000
			await prisma.book.create({
				data: {
				title: book.title,
				author: book.author.replace(/,.*|\(.*?\)/g, '').trim(),
				description: book.description,
				isbn: book.isbn,
					genre: {
						connectOrCreate: book.genres.split(',').map((genre) => {
							return {
								where: { name: genre },
								// replace [] and '
								create: { name: genre.replace(/[\[\]']/g, '').trim(), color: randomColor()},
							};
						}),
					},
				image: book.coverImg,
				pages: Number(book.pages),
				likedPercent: book.likedPercent,
				epub: epub,
				rared,
					price,
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
}

seeder().then(() => process.exit(0))




