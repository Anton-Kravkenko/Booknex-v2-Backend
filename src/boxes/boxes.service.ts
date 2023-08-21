import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class BoxesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService
	) {}

	async getBoxes() {
		return this.prisma.boxes.findMany()
	}

	async getBoxInfoById(id: number) {
		const boxes = await this.prisma.boxes.findUnique({
			where: {
				id: +id
			}
		})

		if (!boxes) throw new BadRequestException('Box not found')
		return boxes
	}

	async openBox(userId: number, boxId: number) {
		console.log(userId, boxId)
	}

	async buyBox(userId: number, boxId: number) {
		const user = await this.usersService.getById(userId, {
			bookMarks: true
		})
		const box = await this.getBoxInfoById(boxId)
		if (user.bookMarks >= box.price) {
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					bookMarks: user.bookMarks - box.price,
					boxes: {
						connect: {
							id: boxId
						}
					}
				}
			})
		} else throw new BadRequestException('Not enough bookMarks')

		return {
			message: 'Box bought',
			bookMarks: user.bookMarks - box.price
		}
	}

	async randomBox(userId: number) {
		const randomBoxPercentage = {
			Common: 0.9,
			Rare: 0.095,
			Exquisite: 0.05
		}
		function weightedRandom(weights: { [key: string]: number }) {
			let i: string
			let sum = 0
			const r = Math.random()

			for (i in weights) {
				sum += weights[i]
				if (r <= sum) return i
			}
		}
		const randomBox = weightedRandom(randomBoxPercentage)
		console.log(randomBox)
		const box = await this.prisma.boxes.findFirst({
			where: {
				rare: randomBox
			}
		})
		if (!box) throw new BadRequestException('Box not found')
		this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				boxes: {
					connect: {
						id: box.id
					}
				}
			}
		})
		return {
			message: 'Random box given',
			box
		}
	}
}
