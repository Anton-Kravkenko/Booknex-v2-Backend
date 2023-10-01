import { Injectable } from '@nestjs/common'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AdminService {
	constructor(private readonly prisma: PrismaService) {}
	async getStats() {
		const totalTimeRead = await this.prisma.history.aggregate({
			_sum: {
				time: true
			}
		})
		return {
			totalUsers: await this.prisma.user.count(),
			totalReadTime: totalTimeRead._sum.time,
			mostReadBook: await this.prisma.book.findMany({
				take: 2,
				select: returnBookObject,
				orderBy: {
					histories: {
						_count: 'desc'
					}
				}
			})
		}
	}
}
