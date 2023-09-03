import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { defaultReturnObject } from '../utils/return-object/return.default.object'

@Injectable()
export class CatalogService {
	constructor(private readonly prisma: PrismaService) {}
	//TODO: Сделать специально для тебя рекомендации книг
	async getCatalog() {
		return {
			popularNow: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					popularity: 'desc'
				},
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
				}
			}),
			newReleases: await this.prisma.book.findMany({
				take: 10,
				orderBy: {
					createdAt: 'desc'
				}
			}),
			genres: await this.prisma.genre.findMany({
				where: { books: { some: {} } },
				select: {
					...defaultReturnObject,
					name: true,
					books: {
						distinct: ['id'],
						take: 10,
						orderBy: {
							createdAt: 'desc'
						}
					}
				}
			})
		}
	}
	search(query: string) {
		return this.prisma.book.findMany({
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
}
