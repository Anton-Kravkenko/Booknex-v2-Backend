import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CreateShelfDto } from './dto/create.shelf.dto'
import { UpdateShelfDto } from './dto/update.shelf.dto'

@Injectable()
export class ShelvesService {
	constructor(private readonly prisma: PrismaService) {}

	async getShelves(userId: number) {
		// TODO: Проверить всё запросы и пофиксить (сделать лучше)
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
		return this.prisma.shelf.findUnique({
			where: {
				id: +shelfId
			}
		})
	}

	async createShelf(dto: CreateShelfDto) {
		return this.prisma.shelf.create({
			data: {
				name: dto.name,
				picture: dto.picture,
				books: {
					connect: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}

	async deleteShelf(id: number) {
		return this.prisma.shelf.delete({
			where: {
				id: +id
			}
		})
	}

	async updateShelf(id: number, dto: UpdateShelfDto) {
		return this.prisma.shelf.update({
			where: {
				id: +id
			},
			data: {
				name: dto.name,
				picture: dto.picture,
				//  TODO: по фиксить чтобы устанавливался массив  id где я конекчу елементы
				books: {
					set: dto.books.map(bookId => ({ id: bookId }))
				}
			}
		})
	}
}
