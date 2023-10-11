import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import { gray, green, magenta, rainbow, yellow } from 'colors'
import { getAverageColor } from 'fast-average-color-node'
import * as process from 'node:process'
import prompts from 'prompts'
import puppeteer from 'puppeteer'
import { randomColor, shadeRGBColor } from '../src/utils/color.functions'
import { simplifyString } from '../src/utils/string.functions'
import { customLinkSelect } from './aditional.functions'
import { ZEpubParser } from './z-epub.parser'

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
	const selectGenres = new Set([
		'Fantasy',
		'Young Adult',
		'Fiction',
		'Adventure',
		'Classics',
		'Post Apocalyptic',
		'School',
		'Historical',
		'Romance',
		'Science Fiction',
		'Adult',
		'Philosophy',
		'Thriller'
	])
	const books = JSON.parse(JSON.stringify([]))
	const lastBook = await prisma.book.findFirst({
		orderBy: {
			id: 'desc'
		},
		take: 1,
		select: {
			id: true,
			description: true
		}
	})
	const lastBookIndex = lastBook
		? books.findIndex(book => book.description === lastBook.description)
		: 0
	console.log(rainbow(`Last book index: ${lastBookIndex}`))
	books
		.filter((book: Book) => book.language === 'English')
		.slice(lastBookIndex + 1, 1000)
		.sort((a: Book, b: Book) => b.numRatings - a.numRatings)
		.filter((book: Book) => book.numRatings > 20_000)
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--autoplay-policy=user-gesture-required',
			'--disable-background-networking',
			'--disable-background-timer-throttling',
			'--disable-backgrounding-occluded-windows',
			'--disable-breakpad',
			'--disable-client-side-phishing-detection',
			'--disable-component-update',
			'--disable-default-apps',
			'--disable-dev-shm-usage',
			'--disable-domain-reliability',
			'--disable-extensions',
			'--disable-features=AudioServiceOutOfProcess',
			'--disable-hang-monitor',
			'--disable-ipc-flooding-protection',
			'--disable-notifications',
			'--disable-offer-store-unmasked-wallet-cards',
			'--disable-popup-blocking',
			'--disable-print-preview',
			'--disable-prompt-on-repost',
			'--disable-renderer-backgrounding',
			'--disable-setuid-sandbox',
			'--disable-speech-api',
			'--disable-sync',
			'--hide-scrollbars',
			'--ignore-gpu-blacklist',
			'--metrics-recording-only',
			'--mute-audio',
			'--no-default-browser-check',
			'--no-first-run',
			'--no-pings',
			'--no-sandbox',
			'--no-zygote',
			'--password-store=basic',
			'--use-gl=swiftshader',
			'--use-mock-keychain',
			'--headless',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-sandbox',
			'--disable-canvas-aa',
			'--disable-2d-canvas-clip-aa',
			'--disable-dev-shm-usage',
			'--no-zygote',
			'--use-gl=swiftshader',
			'--enable-webgl',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-first-run',
			'--disable-infobars',
			'--disable-breakpad',
			'--window-size=1280,1024',
			'--user-data-dir=./chromeData',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions']
	})
	const page = await browser.newPage()
	await page.setRequestInterception(true)
	page.on('request', request => {
		if (request.resourceType() == 'image') {
			void request.abort()
		} else {
			void request.continue()
		}
	})
	for (let index = lastBookIndex + 1; index < books.length; index++) {
		const book = books[index]
		try {
			const oldBook = await prisma.book.findFirst({
				where: {
					title: book.title
				}
			})
			if (oldBook) {
				console.log(gray(`⚠️ ${book.title} by ${book.author} already exists`))
				continue
			}
			const epub:
				| string
				| {
						title: string
						author: string
						link: string
						isbn: string | null
						picture: string
						pages: number | null
				  } = await ZEpubParser(
				book.title,
				book.author.replaceAll(/,.*|\(.*?\)/g, '').trim(),
				Number(book.pages),
				book.numRatings,
				page
			).catch(async () => {
				if (book.numRatings < 200_000) {
					console.log(yellow(`❌ No result for ${book.title}`))
					return
				}
				const customLink = await customLinkSelect({
					title: book.title,
					author: book.author.replaceAll(/,.*|\(.*?\)/g, '').trim()
				})
				if (!customLink) return
			})
			if ((typeof epub === 'string' && !epub) || !epub.link) continue

			const epubFile = await fetch(typeof epub === 'string' ? epub : epub.link)
			const imageFile = await fetch(
				typeof epub === 'string' ? book.coverImg : epub.picture
			)
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
			let BookName: string = typeof epub === 'string' ? book.title : epub.title
			if (BookName.includes('by ')) {
				const response = await prompts({
					type: 'select',
					name: 'value',
					message: `${BookName} - ${magenta(
						BookName.split('by ')[0].trim()
					)} good?`,
					choices: [
						{
							title: `✅ Yes`,
							value: false
						},
						{
							title: '🔍 Write your own Text',
							value: 'custom'
						}
					]
				})
				if (response.value === false) {
					BookName = BookName.split('by')[0].trim()
				}
				if (response.value === 'custom') {
					const customResponse = await prompts({
						type: 'text',
						name: 'value',
						message: `Your text to Book name with author:`,
						initial: BookName
					})
					BookName = customResponse.value
				}
			}
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.AWS_BUCKET,
					Key: `epubs/${simplifyString(BookName)}.epub`,
					Body: epubBuffer,
					ACL: 'public-read',
					ContentType: 'application/epub+zip',
					ContentDisposition: 'inline'
				})
			)
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.AWS_BUCKET,
					Key: `books-covers/${simplifyString(BookName)}.jpg`,
					Body: imageBuffer,
					ACL: 'public-read',
					ContentDisposition: 'inline'
				})
			)

			const filteredGenres = book.genres
				.split(',')
				.map(genre => genre.replaceAll(/['[\]]/g, '').trim())
				.filter(genre => selectGenres.has(genre))
			const BookGenres = await prisma.genre.findMany({
				select: { name: true, majorBooks: true },
				where: {
					OR: filteredGenres.map(genre => ({ name: { contains: genre } }))
				}
			})

			const randomMajorGenre = BookGenres.sort(
				(a, b) => a.majorBooks.length - b.majorBooks.length
			)[0].name as string

			if (BookGenres.length === 0) {
				console.log(`❌ No book genres for ${BookName}`)
			}
			await prisma.book.create({
				data: {
					title: BookName,
					author:
						typeof epub === 'string'
							? book.author.replaceAll(/,.*|\(.*?\)/g, '').trim()
							: epub.author,
					description: book.description,
					popularity: book.numRatings,
					isbn: typeof epub === 'string' || !epub.isbn ? book.isbn : epub.isbn,
					color: shadeRGBColor(
						await getAverageColor(book.coverImg).then(color => color.hex),
						-25
					),
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
						connectOrCreate: BookGenres.map(genre => genre.name).map(
							(genre: string) => ({
								where: {
									name: genre
								},
								create: {
									name: genre,
									color: shadeRGBColor(randomColor(), -50)
								}
							})
						)
					},
					picture: `books-covers/${simplifyString(BookName)}.jpg`,
					pages:
						typeof epub === 'string' || !epub.pages
							? Number(book.pages)
							: Number(epub.pages),
					likedPercentage: book.likedPercent,
					epub: `epubs/${simplifyString(BookName)}.epub`
				}
			})
			console.log(
				green(
					`✅ ${index}: ${BookName} by ${book.author
						.replaceAll(/,.*|\(.*?\)/g, '')
						.trim()}`
				)
			)
		} catch {
			/* empty */
		}
	}
	await browser.close()
}

void seeder().then(value => {
	console.log(value)
	process.exit(0)
})
