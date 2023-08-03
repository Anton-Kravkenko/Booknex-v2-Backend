import { green } from 'colors'
import * as fs from 'fs'
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
export const seeder = async () => {
	const books = []
		.filter((book: Book) => book.language === 'English')
		.slice(0, 1000)

	const resolvedBooks = []

	for (let i = 0; i < books.length; i++) {
		const book = books[i]
		try {
			const epub = await getEpubFromBook(book.title, book.author)
			if (!epub) {
				continue
			}
			console.log(green(`Epub for ${book.title} is ${epub} in ${i} iteration`))
			resolvedBooks.push({
				title: book.title,
				author: book.author,
				rating: book.rating,
				description: book.description,
				isbn: book.isbn,
				genres: book.genres,
				pages: book.pages,
				publishDate: book.publishDate || book.firstPublishDate,
				likedPercent: book.likedPercent,
				coverImg: book.coverImg,
				epub
			})
		} catch (error) {
			console.error(
				`Failed to generate ePub for ${book.title} by ${book.author}: ${error}`
			)
		}
	}

	fs.writeFileSync('seeder/epub0-1000.json', JSON.stringify(resolvedBooks))
}

seeder().then(() => process.exit(0))
