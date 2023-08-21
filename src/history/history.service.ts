import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { defaultReturnObject } from '../utils/return-object/return.default.object'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { AddHistoryDto } from './dto/add.history.dto'

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
	async addHistory(userId: number, dto: AddHistoryDto) {
		await this.prisma.history.create({
			data: {
				time: dto.time,
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
