import { PrismaClient } from '@prisma/client'
import { green } from 'colors'
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
	const books = JSON.parse(JSON.stringify(JsonBooks))
	const { id: lastBookIndex } = await prisma.book.findFirst({
		orderBy: {
			id: 'desc'
		},
		take: 1,
		select: {
			id: true
		}
	})
	books.filter((book: Book) => book.language === 'English')
		.slice(lastBookIndex + 1, 1000).sort((a: Book, b: Book) => b.numRatings - a.numRatings).filter((book: Book) => book.numRatings > 30000)
	for (let i = lastBookIndex + 1; i < books.length; i++) {
		const book = books[i]
		try {
			const oldBook = await prisma.book.findFirst({
				where: {
					title: book.title,
				}
			})
			if (oldBook) {
				continue
			}
			const epub = await getEpubFromBook(
				book.title, book.author.replace(/,.*|\(.*?\)/g, '').trim(), 	book.numRatings)
			if (!epub) {
				continue
			}
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
								create: { name: genre },
							};
						}),
					},
				image: book.coverImg,
				pages: Number(book.pages),
				likedPercent: book.likedPercent,
				epub: epub,
				rared: book.numRatings < 1000 ? 'Common' : book.numRatings < 10000 ? 'Uncommon' : book.numRatings < 100000 ? 'Rare' : book.numRatings < 1000000 ? 'Very Rare' : book.numRatings < 5000000 ? 'Legendary' : 'Mythical',
					},
				})
			console.log(green(`✅ ${i}: ${book.title} by ${book.author.replace(/,.*|\(.*?\)/g, '').trim()}`))
		} catch (error) {
			console.error(
				`❌ Failed to generate ePub for ${book.title} by ${book.author}: ${error}`
			)
		}
	}

}

seeder().then(() => process.exit(0))




