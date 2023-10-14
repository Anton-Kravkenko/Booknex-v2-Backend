import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AddHistoryDto } from './dto/add.history.dto'

@Injectable()
export class HistoryService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: number, dto: AddHistoryDto) {
		const books = await this.prisma.book.findMany({
			where: {
				id: {
					in: dto.histories.map(item => item.bookId)
				}
			}
		})

		if (books.length !== dto.histories.length) {
			throw new BadRequestException('Some books not found')
		}

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				history: {
					createMany: {
						data: dto.histories.map(item => {
							return {
								time: item.time,
								bookId: item.bookId
							}
						})
					}
				}
			}
		})
	}
}
