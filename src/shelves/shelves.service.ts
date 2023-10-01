import { Injectable, NotFoundException } from '@nestjs/common'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'
import { randomColor, shadeRGBColor } from '../utils/color.functions'
import { CreateShelfDto } from './dto/create.shelf.dto'
import { UpdateShelfDto } from './dto/update.shelf.dto'

@Injectable()
export class ShelvesService {
	constructor(private readonly prisma: PrismaService) {}

	async getShelves(userId: number) {
		const likedShelves = await this.prisma.shelf.findMany({
			where: {
				like: {
					some: {
						id: userId
					}
				}
			}
		})
		const otherShelves = await this.prisma.shelf.findMany({
			orderBy: {
				like: {
					_count: 'desc'
				}
			},
			where: {
				like: {
					none: {
						id: userId
					}
				},
				unwatched: {
					none: {
						id: userId
					}
				}
			}
		})

		return [...likedShelves, ...otherShelves]
	}

	async getShelfById(shelfId: number) {
		const shelf = await this.prisma.shelf.findUnique({
			where: {
				id: +shelfId
			},
			include: {
				books: {
					select: returnBookObject
				}
			}
		})

		if (!shelf) throw new NotFoundException('Shelf not found').getResponse()
		return shelf
	}

	async createShelf(dto: CreateShelfDto) {
		return this.prisma.shelf.create({
			data: {
				name: dto.name,
				color: shadeRGBColor(randomColor(), -50),
				picture: dto.picture,
				books: {
					connect: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}

	async deleteShelf(id: number) {
		await this.getShelfById(+id)
		return this.prisma.shelf.delete({
			where: {
				id: +id
			}
		})
	}

	async updateShelf(id: number, dto: UpdateShelfDto) {
		await this.getShelfById(+id)
		const booksExists = await this.prisma.book.findMany({
			where: {
				id: {
					in: dto.books
				}
			}
		})
		if (booksExists.length !== dto.books.length) {
			throw new NotFoundException('Some books not found').getResponse()
		}
		return this.prisma.shelf.update({
			where: {
				id: +id
			},
			data: {
				name: dto.name,
				picture: dto.picture,
				books: {
					set: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}
}
