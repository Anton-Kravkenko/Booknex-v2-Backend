import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { returnBookObject } from '../utils/return-object/return.book.object'

@Injectable()
export class CatalogService {
	constructor(private readonly prisma: PrismaService) {}
	async getCatalog(userId: number) {
		return {
			recomedations: await this.getRecommendations(userId),
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
			...(
				await this.prisma.genre.findMany({
					take: 10,
					include: {
						books: {
							take: 10,
							orderBy: {
								popularity: 'desc'
							},
							select: returnBookObject
						}
					}
				})
			).reduce((acc, genre) => {
				acc[genre.name] = genre.books
				return acc
			}, {})
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
		const userMostLikedBook = await this.prisma.book.findMany({
			where: {
				likedBy: {
					some: {
						id: userId
					}
				}
			},
			include: {
				genre: {
					select: {
						id: true
					}
				}
			}
		})
		const userMostLikedGenresIds = userMostLikedBook.map(genre => genre.id)
		console.log(userMostLikedGenresIds)
		return {
			userMostLikedGenresIds
		}
	}
}
