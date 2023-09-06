import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { defaultReturnObject } from '../utils/return-object/return.default.object'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { AddHistoryDto } from './dto/add.history.dto'

@Injectable()
export class HistoryService {
	constructor(private readonly prisma: PrismaService) {}

	getUserHistory(userId: number) {
		return this.prisma.history.findMany({
			select: {
				...defaultReturnObject,
				book: true,
				user: {
					select: returnUserObject
				}
			},
			where: {
				userId: userId
			}
		})
	}

	getHistoryByBookId(bookId: number) {
		return this.prisma.history.findMany({
			select: {
				...defaultReturnObject,
				book: false,
				time: true
			},
			where: {
				bookId: +bookId
			}
		})
	}
	async addHistory(userId: number, dto: AddHistoryDto) {
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				history: {
					createMany: {
						data: dto.history.map(item => {
							return {
								bookId: item.bookId,
								time: item.time
							}
						})
					}
				}
			}
		})
		return {
			message: 'History added'
		}
	}
}
