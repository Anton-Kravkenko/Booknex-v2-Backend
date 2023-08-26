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
	async buyBook(userId: number, bookId: number) {
		const user = await this.usersService.getById(+userId, {
			buyBooks: true,
			bookMarks: true
		})
		if (!user) return new BadRequestException('User not found')
		const isBought = user.buyBooks.some(item => item.id === +bookId)
		if (isBought)
			return new BadRequestException(
				'You already bought this book'
			).getResponse()
		const book = await this.prisma.book.findUnique({
			where: { id: +bookId }
		})
		if (!book) return new BadRequestException('Book not found').getResponse()
		if (user.bookMarks - book.price < 0)
			return new BadRequestException('You dont have enough money').getResponse()
		await this.prisma.user.update({
			where: { id: +userId },
			data: {
				bookMarks: +user.bookMarks - book.price,
				buyBooks: {
					connect: { id: +bookId }
				}
			}
		})
		return {
			message: 'Success',
			bookMarks: user.bookMarks - book.price
		}
	}
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
