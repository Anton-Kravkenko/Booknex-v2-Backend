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
	coverImg,
	pages,
	likedPercent,
	numRatings,
	genres,
	page,
	s3
}: {
	title: string
	author: {
		name: string
		picture: string
		description: string
	}
	description: string
	coverImg: string
	pages: number
	likedPercent: number
	numRatings: number
	genres: string[]
	page: Page
	s3: S3Client
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
			return console.log(gray(`⚠️ ${title} by ${author.name} already exists`))
		}
		const epub:
			| string
			| {
					title: string
					author: string
					link: string
					picture: string
					pages: number | null
			  } = await ZEpubParser(
			title,
			author.name,
			pages,
			numRatings,
			page
		).catch(async () => {
			if (numRatings < 100_000) {
				console.log(yellow(`❌ No result for ${title}`))
				return
			}
			const customLink = await customLinkSelect({
				title: title,
				author: author.name
			})
			if (!customLink) return
		})
		if ((typeof epub === 'string' && !epub) || !epub.link) return
		const epubFile = await fetch(typeof epub === 'string' ? epub : epub.link)
		const imageFile = await fetch(
			typeof epub === 'string' ? coverImg : epub.picture
		)
		const authorFile = await fetch(author.picture)

		const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
		const authorBuffer = Buffer.from(await authorFile.arrayBuffer())
		const epubBuffer = Buffer.from(await epubFile.arrayBuffer())
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
				Key: `author-picture/${simplifyString(author.name)}.jpg`,
				Body: authorBuffer,
				ACL: 'public-read',
				ContentDisposition: 'inline'
			})
		)

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
			return console.log(`❌ No book genres for ${BookName}`)
		}
		await prisma.book.create({
			data: {
				title: BookName,
				author: {
					connectOrCreate: {
						where: {
							name: author.name
						},
						create: {
							name: author.name,
							picture: `author-picture/${simplifyString(author.name)}.jpg`,
							description: author.description
						}
					}
				},
				description: description,
				popularity: numRatings,
				color: shadeRGBColor(
					await getAverageColor(imageBuffer).then(color => color.hex),
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
					typeof epub === 'string' || !epub.pages ? pages : Number(epub.pages),
				likedPercentage: likedPercent,
				epub: `epubs/${simplifyString(BookName)}.epub`
			}
		})
		console.log(green(`✅ ${BookName} by ${author.name}`))
	} catch (e) {
		console.log(yellow(`❌ Error for ${title}` + e))
	}
}
