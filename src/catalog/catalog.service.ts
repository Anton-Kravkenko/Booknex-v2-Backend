import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { returnBookObject } from '../utils/return-object/return.book.object'

@Injectable()
export class CatalogService {
	constructor(private readonly prisma: PrismaService) {}
	async getCatalog(userId: number) {
		return {
			recommendations: await this.getRecommendations(userId),
			popularNow: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					popularity: 'desc'
				},
				select: returnBookObject,
				where: {
					history: {
						some: {
							createdAt: {
								gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
							}
						}
					}
				}
			}),
			bestSellers: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					popularity: 'desc'
				},
				select: returnBookObject
			}),
			newReleases: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					createdAt: 'desc'
				},
				select: returnBookObject
			}),
			genres: await this.prisma.genre.findMany({
				take: 10,
				select: {
					name: true,
					books: {
						take: 10,
						orderBy: {
							popularity: 'desc'
						},
						select: returnBookObject
					}
				}
			})
		}
	}
	search(query: string) {
		return this.prisma.book.findMany({
			select: returnBookObject,
			where: {
				OR: [
					{
						title: {
							contains: query
						}
					},
					{
						author: {
							contains: query
						}
					},
					{
						isbn: {
							contains: query
						}
					}
				]
			}
		})
	}

	async getRecommendations(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				likedBooks: {
					select: {
						genre: {
							select: {
								name: true
							}
						}
					}
				}
			}
		})
		if (!user) throw new NotFoundException('User not found')

		const genres = Object.entries(
			user.likedBooks.reduce((acc, book) => {
				book.genre.forEach(
					genre => (acc[genre.name] = (acc[genre.name] || 0) + 1)
				)
				return acc
			}, {})
		)
			.sort((a, b) => Number(b[1]) - Number(a[1]))
			.slice(0, 3)
			.map(item => item[0]) || ['Fantasy', 'Romance', 'Mystery']

		return this.prisma.book.findMany({
			take: 10,
			orderBy: { popularity: 'desc' },
			select: returnBookObject,
			where: {
				genre: {
					some: {
						name: {
							in: genres
						}
					}
				},
				AND: {
					NOT: {
						likedBy: {
							some: {
								id: userId
							}
						}
					}
				}
			}
		})
	}
}
