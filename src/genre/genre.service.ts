import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { returnBookObject } from '../utils/return-object/return.book.object'

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	getGenres() {
		return this.prisma.genre.findMany()
	}

	async getGenreById(id: number) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				id: +id
			},
			include: {
				books: {
					orderBy: {
						popularity: 'desc'
					},
					select: returnBookObject
				},
				shelves: true
			}
		})
		if (!genre) throw new NotFoundException('Genre not found').getResponse()
		return {
			id: genre.id,
			createdAt: genre.createdAt,
			updatedAt: genre.updatedAt,
			name: genre.name,
			catalog: genre.books.map((book, index) => {
				if (index % 4 === 0) {
					return {
						...genre.shelves[index / 4]
					}
				} else {
					return book
				}
			})
		}
	}
}
