import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { getAverageColor } from 'fast-average-color-node'
import { GenreReturnObject } from '../genre/return.genre.object'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { randomColor, shadeRGBColor } from '../utils/color.functions'
import { CreateBookDto, EditBookDto } from './dto/manipulation.book.dto'
import { ReviewBookDto } from './dto/review.book.dto'
import { returnBookObject } from './return.book.object'
import { returnReviewsObject } from './return.reviews.object'

@Injectable()
export class BookService {
	constructor(
		private readonly usersService: UsersService,
		private readonly prisma: PrismaService
	) {}

	async getBookById(id: number, selectObject: Prisma.BookSelect = {}) {
		const book = await this.prisma.book.findUnique({
			where: { id },
			select: {
				...returnBookObject,
				...selectObject
			}
		})
		if (!book) throw new NotFoundException('Book not found').getResponse()
		return book
	}

	async getAllBooks() {
		return this.prisma.book.findMany({
			select: returnBookObject
		})
	}

	async createBook(dto: CreateBookDto) {
		await this.prisma.book.create({
			data: {
				title: dto.title,
				likedPercentage: dto.likedPercentage,
				popularity: dto.popularity,
				pages: dto.pages,
				description: dto.description,
				image: dto.image,
				epub: dto.epub,
				isbn: dto.isbn,
				author: dto.author,
				majorGenre: {
					connectOrCreate: {
						where: { name: dto.majorGenre },
						create: {
							name: dto.majorGenre,
							color: shadeRGBColor(randomColor(), -50)
						}
					}
				},
				color: shadeRGBColor(
					await getAverageColor(dto.image).then(color => color.hex),
					-25
				),
				genres: {
					connectOrCreate: dto.genres.map(g => ({
						where: { name: g },
						create: { name: g, color: shadeRGBColor(randomColor(), -50) }
					}))
				}
			}
		})
	}

	async deleteBook(id: number) {
		const book = await this.getBookById(id)
		await this.prisma.book.delete({ where: { id: book.id } })
	}

	async updateBook(id: number, dto: EditBookDto) {
		const book = await this.getBookById(id)
		await this.prisma.book.update({
			where: { id: book.id },
			data: {
				title: dto.title || book.title,
				likedPercentage: dto.likedPercentage
			}
		})
	}

	getEmotions() {
		return this.prisma.emotion.findMany({
			select: {
				name: true,
				path: true
			}
		})
	}

	async reviewBook(userId: number, bookId: number, dto: ReviewBookDto) {
		await this.usersService.getUserById(userId)
		await this.getBookById(bookId)
		await this.prisma.review.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				book: {
					connect: {
						id: bookId
					}
				},
				tags: dto.tags,
				emotion: {
					connect: {
						name: dto.emotion
					}
				},
				text: dto.comment
			}
		})
	}

	async getBookInfoById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id: +id },
			include: {
				majorGenre: false,
				genres: { select: GenreReturnObject },
				reviews: {
					select: returnReviewsObject
				}
			}
		})
		if (!book) return new NotFoundException('Book not found').getResponse()
		const genreIds = book.genres.map(g => g.id)
		const similarBooks = await this.prisma.book.findMany({
			where: {
				id: { not: +id },
				genres: { some: { id: { in: genreIds } } }
			},
			select: {
				...returnBookObject,
				genres: { select: GenreReturnObject }
			}
		})

		return {
			...book,
			similarBooks: similarBooks
				.sort(
					(a, b) =>
						b.genres.filter(g => genreIds.includes(g.id)).length -
						a.genres.filter(g => genreIds.includes(g.id)).length
				)
				.slice(0, 10)
				.map(({ genres, ...rest }) => ({ ...rest }))
		}
	}
}
