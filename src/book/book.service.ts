import { Injectable, NotFoundException } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { getAverageColor } from 'fast-average-color-node'
import { returnAuthorObject } from '../author/return.author.object'
import { GenreReturnObject } from '../genre/return.genre.object'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { randomColor, shadeRGBColor } from '../utils/color.functions'
import type { CreateBookDto, EditBookDto } from './dto/manipulation.book.dto'
import type { ReviewBookDto } from './dto/review.book.dto'
import { returnBookObject } from './return.book.object'
import { returnReviewsObject } from './return.reviews.object'

@Injectable()
export class BookService {
	constructor(
		private readonly usersService: UserService,
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

	async ebookById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id },
			select: {
				charapters: true,
				file: true
			}
		})
		if (!book) throw new NotFoundException('Book not found').getResponse()
		return {
			charapters: book.charapters,
			file: book.file
		}
	}

	async all(cursorId: number) {
		return this.prisma.book.findMany({
			take: 20,
			select: returnBookObject,
			cursor: cursorId && { id: cursorId }
		})
	}

	async create(dto: CreateBookDto) {
		await this.prisma.book.create({
			data: {
				genre: {
					connectOrCreate: {
						where: { name: dto.majorGenre },
						create: {
							name: dto.majorGenre,
							color: shadeRGBColor(randomColor(), -50)
						}
					}
				},
				title: dto.title,
				likedPercentage: dto.likedPercentage,
				popularity: dto.popularity,
				pages: dto.pages,
				description: dto.description,
				picture: dto.picture,
				file: dto.epub,
				author: {
					connect: {
						name: dto.author.name
					}
				},
				color: shadeRGBColor(
					await getAverageColor(dto.picture).then(color => color.hex),
					-25
				)
			}
		})
	}

	async delete(id: number) {
		const book = await this.getBookById(id)
		await this.prisma.book.delete({ where: { id: book.id } })
	}

	async update(id: number, dto: EditBookDto) {
		const book = await this.getBookById(id)
		await this.prisma.book.update({
			where: { id: book.id },
			data: {
				title: dto.title || book.title,
				likedPercentage: dto.likedPercentage || book.likedPercentage,
				popularity: dto.popularity || book.popularity,
				pages: dto.pages || book.pages,
				description: dto.description || book.description,
				picture: dto.picture || book.picture,
				author: {
					connect: {
						name: dto.author || book.author.name
					}
				},
				genre: {
					connect: {
						name: dto.majorGenre || 'asd'
					}
				}
			}
		})
	}

	emotions() {
		return this.prisma.emotion.findMany({
			select: {
				name: true,
				path: true
			}
		})
	}

	async review(userId: number, bookId: number, dto: ReviewBookDto) {
		await this.usersService.getUserById(userId)
		await this.getBookById(bookId)
		const emoji = await this.prisma.emotion.findUnique({
			where: { name: dto.emotion }
		})
		if (!emoji) throw new NotFoundException('Emotion not found').getResponse()
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

	async reviewsById(id: number, cursorId: number) {
		return this.prisma.review.findMany({
			where: { bookId: id },
			take: 20,
			cursor: cursorId && { id: cursorId },
			select: returnReviewsObject
		})
	}

	async infoById(id: number) {
		const book = await this.prisma.book.findUnique({
			where: { id: +id },
			include: {
				author: {
					select: returnAuthorObject
				},
				genre: { select: GenreReturnObject }
			}
		})
		if (!book) return new NotFoundException('Book not found').getResponse()
		const similarBooks = await this.prisma.book.findMany({
			where: {
				id: { not: +id },
				genre: {
					id: book.genre.id
				}
			},
			select: {
				...returnBookObject,
				genre: { select: GenreReturnObject }
			}
		})

		return {
			...book,
			similarBooks: similarBooks.slice(0, 10)
		}
	}
}
