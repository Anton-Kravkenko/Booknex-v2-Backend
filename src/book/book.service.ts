import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { returnBookObject } from '../utils/return-object/return.book.object'
import { GenreReturnObject } from '../utils/return-object/return.genre.object'
import { ReviewBookDto } from './dto/book.dto'

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
		if (!book) throw new BadRequestException('User not found').getResponse()
		return book
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
				emotion: dto.emotion,
				text: dto.comment
			}
		})

		return {
			message: 'Review added'
		}
	}
	//TODO: возможно упросить silimarBooks по необходимости
	async getBookInfoById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id: +id },
			include: {
				genre: { select: GenreReturnObject }
			}
		})
		if (!book) return new BadRequestException('Book not found').getResponse()
		const genreIds = book.genre.map(g => g.id)
		const similarBooks = await this.prisma.book.findMany({
			where: {
				id: { not: +id },
				genre: { some: { id: { in: genreIds } } }
			},
			select: {
				...returnBookObject,
				genre: { select: GenreReturnObject }
			}
		})

		return {
			...book,
			similarBook: similarBooks
				.sort(
					(a, b) =>
						b.genre.filter(g => genreIds.includes(g.id)).length -
						a.genre.filter(g => genreIds.includes(g.id)).length
				)
				// no genre field
				.slice(0, 10)
				.map(({ genre, ...rest }) => ({ ...rest }))
		}
	}
}
