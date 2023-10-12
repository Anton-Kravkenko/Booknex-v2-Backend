import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import { gray, green, magenta, yellow } from 'colors'
import { getAverageColor } from 'fast-average-color-node'
import * as process from 'node:process'
import prompts from 'prompts'
import { Page } from 'puppeteer'
import { randomColor, shadeRGBColor } from '../src/utils/color.functions'
import { simplifyString } from '../src/utils/string.functions'
import { customLinkSelect } from './aditional.functions'
import { ZEpubParser } from './z-epub.parser'

const prisma = new PrismaClient()
export const uploadBook = async ({
	title,
	author,
	description,
	isbn,
	coverImg,
	pages,
	likedPercent,
	numRatings,
	genres,
	page
}: {
	title: string
	author: {
		name: string
		picture: string
		description: string
	}
	description: string
	isbn: string
	coverImg: string
	pages: string
	likedPercent: number
	numRatings: number
	genres: string
	page: Page
}) => {
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
	try {
		const oldBook = await prisma.book.findFirst({
			where: {
				title: title
			}
		})
		if (oldBook) {
			console.log(gray(`⚠️ ${title} by ${author.name} already exists`))
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
			title,
			author.name.replaceAll(/,.*|\(.*?\)/g, '').trim(),
			Number(pages),
			numRatings,
			page
		).catch(async () => {
			if (numRatings < 200_000) {
				console.log(yellow(`❌ No result for ${title}`))
				return
			}
			const customLink = await customLinkSelect({
				title: title,
				author: author.name.replaceAll(/,.*|\(.*?\)/g, '').trim()
			})
			if (!customLink) return
		})
		if ((typeof epub === 'string' && !epub) || !epub.link) return

		const epubFile = await fetch(typeof epub === 'string' ? epub : epub.link)
		const imageFile = await fetch(
			typeof epub === 'string' ? coverImg : epub.picture
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
		let BookName: string = typeof epub === 'string' ? title : epub.title
		if (BookName.includes('by ')) {
			const response = await prompts({
				type: 'select',
				name: 'value',
				message: `${BookName} - ${magenta(
					BookName.split('by ')[0].trim()
				)} good?`,
				choices: [
					{
						title: '✅ Yes',
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
					message: 'Your text to Book name with author:',
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

		const filteredGenres = genres
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
		)[0].name

		if (BookGenres.length === 0) {
			console.log(`❌ No book genres for ${BookName}`)
		}
		await prisma.book.create({
			data: {
				title: BookName,
				author: {
					connectOrCreate: {
						where: {
							name: author.name.replaceAll(/,.*|\(.*?\)/g, '').trim()
						},
						create: {
							name: author.name.replaceAll(/,.*|\(.*?\)/g, '').trim(),
							picture: author.picture,
							description: author.description
						}
					}
				},
				description: description,
				popularity: numRatings,
				isbn: typeof epub === 'string' || !epub.isbn ? isbn : epub.isbn,
				color: shadeRGBColor(
					await getAverageColor(coverImg).then(color => color.hex),
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
						? Number(pages)
						: Number(epub.pages),
				likedPercentage: likedPercent,
				epub: `epubs/${simplifyString(BookName)}.epub`
			}
		})
		console.log(
			green(
				`✅ ${BookName} by ${author.name.replaceAll(/,.*|\(.*?\)/g, '').trim()}`
			)
		)
	} catch {
		/* empty */
	}
}
