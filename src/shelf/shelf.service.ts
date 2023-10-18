import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'
import { abbrNumber } from '../utils/abbr-number'
import { randomColor, shadeRGBColor } from '../utils/color.functions'
import { CreateShelfDto } from './dto/create.shelf.dto'
import { UpdateShelfDto } from './dto/update.shelf.dto'
import { returnShelfObject } from './return.shelf.object'

@Injectable()
export class ShelfService {
	constructor(private readonly prisma: PrismaService) {}
	async byId(shelfId: number, selectObject: Prisma.ShelfSelect = {}) {
		const shelf = await this.prisma.shelf.findUnique({
			where: {
				id: +shelfId
			},
			select: {
				...returnShelfObject,
				...selectObject
			}
		})
		if (!shelf) throw new NotFoundException('Shelf not found').getResponse()
		return shelf
	}

	async infoById(shelfId: number) {
		const shelf = await this.prisma.shelf.findUnique({
			where: {
				id: +shelfId
			},
			select: {
				...returnShelfObject,
				description: true,
				_count: {
					select: {
						books: true,
						watched: true
					}
				},
				books: {
					select: {
						...returnBookObject,
						pages: true,
						likedPercentage: true
					}
				}
			}
		})

		if (!shelf) throw new NotFoundException('Shelf not found').getResponse()
		return {
			...shelf,
			_count: undefined,
			statistics: [
				{
					title: 'Books',
					count: shelf._count.books
				},
				{
					title: 'Watched',
					count: `${abbrNumber(shelf._count.watched, 1)}+`
				}
			]
		}
	}

	async catalog(userId: number) {
		const likedShelves = await this.prisma.shelf.findMany({
			select: {
				...returnShelfObject,
				picture: true
			},
			where: {
				watched: {
					some: {
						id: userId
					}
				}
			}
		})
		const otherShelves = await this.prisma.shelf.findMany({
			take: 10,
			select: {
				...returnShelfObject,
				icon: true
			},
			orderBy: {
				watched: {
					_count: 'desc'
				}
			},
			where: {
				watched: {
					none: {
						id: userId
					}
				},
				hidden: {
					none: {
						id: userId
					}
				}
			}
		})

		return [...likedShelves, ...otherShelves]
	}

	async all(cursorId: number) {
		console.log(cursorId)
		return this.prisma.shelf.findMany({
			take: 20,
			cursor: cursorId && { id: cursorId }
		})
	}

	async create(dto: CreateShelfDto) {
		const shelfExists = await this.prisma.shelf.findUnique({
			where: {
				title: dto.title
			}
		})
		if (shelfExists)
			throw new NotFoundException('Shelf already exists').getResponse()
		return this.prisma.shelf.create({
			data: {
				title: dto.title,
				icon: dto.icon,
				color: shadeRGBColor(randomColor(), -20),
				picture: dto.picture,
				books: {
					connect: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}

	async delete(id: number) {
		await this.byId(+id)
		return this.prisma.shelf.delete({
			where: {
				id: +id
			}
		})
	}

	async update(id: number, dto: UpdateShelfDto) {
		await this.byId(+id)
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
				title: dto.title,
				picture: dto.picture,
				icon: dto.icon,
				books: {
					set: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}
}
