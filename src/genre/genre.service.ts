import { Injectable, NotFoundException } from '@nestjs/common'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'
import { defaultReturnObject } from '../utils/return.default.object'

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
			select: {
				...defaultReturnObject,
				name: true,
				color: true,
				similar: {
					select: {
						id: true
					}
				}
			}
		})
		if (!genre) throw new NotFoundException('Genre not found').getResponse()
		const newestBooks = await this.prisma.book.findMany({
			take: 10,
			select: {
				...returnBookObject,
				color: true,
				description: true
			},
			where: {
				majorGenre: {
					id: +id
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		const bestSellers = await this.prisma.book.findMany({
			take: 10,
			select: returnBookObject,
			where: {
				majorGenre: {
					id: +id
				}
			},
			orderBy: {
				popularity: 'desc'
			}
		})

		const bestSellersFromSimilar = await this.prisma.genre.findMany({
			where: {
				id: {
					in: genre.similar.map(g => g.id)
				}
			},
			select: {
				...defaultReturnObject,
				name: true,
				majorBooks: {
					select: returnBookObject,
					take: 10,
					orderBy: {
						popularity: 'desc'
					}
				}
			}
		})

		return {
			...genre,
			similar: undefined,
			newestBooks,
			bestSellers,
			bestSellersFromSimilar
		}
	}
}
