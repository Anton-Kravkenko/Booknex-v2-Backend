import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { defaultReturnObject } from '../utils/return-object/return.default.object'
import { GenreReturnObject } from '../utils/return-object/return.genre.object'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { ReviewBookDto } from './dto/book.dto'

@Injectable()
export class BookService {
	constructor(
		private readonly usersService: UsersService,
		private readonly prisma: PrismaService
	) {}

	async reviewBook(userId: number, bookId: number, dto: ReviewBookDto) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user) throw new BadRequestException('User not found').getResponse()
		const book = await this.prisma.book.findUnique({
			where: { id: bookId }
		})

		if (!book) return new BadRequestException('Book not found').getResponse()

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
	async getBookInfoById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id: +id },
			include: {
				reviews: {
					select: {
						...defaultReturnObject,
						text: true,
						emotion: true,
						user: {
							select: returnUserObject
						}
					}
				},
				genre: {
					select: GenreReturnObject
				}
			}
		})
		const similarBooks = await this.prisma.book.findMany({
			where: {
				id: { not: +id },
				genre: {
					some: {
						id: { in: book.genre.map(g => g.id) }
					}
				}
			},
			include: {
				genre: { select: GenreReturnObject }
			}
		})

		if (!book) return new BadRequestException('Book not found').getResponse()

		return {
			...book,
			similarBook: similarBooks
				.sort((a, b) => {
					const commonGenresA = a.genre.filter(g =>
						book.genre.map(g => g.id).includes(g.id)
					).length
					const commonGenresB = b.genre.filter(g =>
						book.genre.map(g => g.id).includes(g.id)
					).length
					return commonGenresB - commonGenresA
				})
				.slice(0, 10)
		}
	}
}
