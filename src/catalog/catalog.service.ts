import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { returnBookObject } from '../utils/return-object/return.book.object'
import { defaultReturnObject } from '../utils/return-object/return.default.object'

@Injectable()
export class CatalogService {
	constructor(private readonly prisma: PrismaService) {}
	async getCatalog(userId: number) {
		return {
			//TODO: Сделать тут жанры которые пользователь выбрал при регистрации и те, которые в реках
			mostRelatedGenres: await this.prisma.genre
				.findMany({
					select: {
						...defaultReturnObject,
						name: true
					},
					where: {
						OR: [
							{
								books: {
									some: {
										likedBy: {
											some: {
												id: userId
											}
										}
									}
								}
							},
							{
								name: {
									in: ['Fantasy', 'Romance', 'Horror', 'Thriller', 'Sci-Fi']
								}
							}
						]
					}
				})
				.then(genres =>
					genres
						.sort(
							(a, b) =>
								genres.filter(genre => genre.name === a.name).length -
								genres.filter(genre => genre.name === b.name).length
						)
						.slice(0, 5)
				),
			recommendations: await this.getRecommendations(userId),
			popularNow: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					popularity: 'desc'
				},
				select: {
					...returnBookObject,
					description: true
				},
				where: {
					histories: {
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
				take: 5,
				select: {
					name: true,
					majorBooks: {
						orderBy: {
							createdAt: 'desc'
						},
						take: 10,
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
		const likedGenres = await this.prisma.genre.findMany({
			select: {
				name: true
			},
			where: {
				books: {
					some: {
						likedBy: {
							some: {
								id: userId
							}
						}
					}
				}
			}
		})
		//TODO: сделать это короче
		const genres = Object.entries(
			likedGenres.reduce((acc, book) => {
				book.name.split(',').forEach(genre => {
					if (acc[genre]) acc[genre]++
					else acc[genre] = 1
				})
				return acc
			}, {})
		)
			.sort((a, b) => Number(b[1]) - Number(a[1]))
			.slice(0, 5)
			.map(item => item[0])
		console.log(genres)
		return this.prisma.book.findMany({
			take: 10,
			orderBy: { popularity: 'desc' },
			select: returnBookObject,
			where: {
				genres: {
					some: {
						name: {
							// TODO: fix this: add user likes genre in first
							in: genres.length ? genres : ['Fantasy', 'Romance']
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
