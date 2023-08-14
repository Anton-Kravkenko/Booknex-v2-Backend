import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { defaultReturnObject } from '../utils/return-object/return.default.object'
import { returnUserObject } from '../utils/return-object/return.user.object'

@Injectable()
export class HistoryService {
	constructor(private readonly prisma: PrismaService) {}

	getHistory(userId: number) {
		return this.prisma.history.findMany({
			select: {
				...defaultReturnObject,
				books: true,
				user: {
					select: returnUserObject
				}
			},
			where: {
				userId: userId
			}
		})
	}
	async addHistory(userId: number, dto: { bookIds: number[] }) {
		await this.prisma.history.create({
			data: {
				books: {
					connect: dto.bookIds.map(id => ({ id }))
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return {
			message: 'History added'
		}
	}
}
