import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { GenreReturnObject } from '../utils/return-object/return.genre.object'

@Injectable()
export class BookService {
	constructor(
		private readonly usersService: UsersService,
		private readonly prisma: PrismaService
	) {}

	// TODO: сделать оставление отзыва
	async reviewBook(userId: number, bookId: number) {
		console.log(userId, bookId)
	}
	async getBookInfoById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id: +id },
			include: {
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
