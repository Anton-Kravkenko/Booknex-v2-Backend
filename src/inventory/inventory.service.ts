import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { weightedRandom } from '../utils/weighted-random'

@Injectable()
export class InventoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService
	) {}

	async openBox(userId: number, boxId: number) {
		console.log(userId, boxId)
	}

	async buyBox(userId: number, boxId: number) {
		const user = await this.usersService.getById(userId, {
			bookMarks: true
		})
		// const box = await this.getBoxInfoById(boxId)
		// if (user.bookMarks >= box.price) {
		// await this.prisma.user.update({
		// 	where: {
		// 		id: userId
		// 	},
		// 	data: {
		// 		bookMarks: user.bookMarks - box.price,
		// 		boxes: {
		// 			connect: {
		// 				id: boxId
		// 			}
		// 		}
		// 	}
		// })
		// } else throw new BadRequestException('Not enough bookMarks')

		return {
			message: 'Box bought'
			// bookMarks: user.bookMarks - box.price
		}
	}

	async randomItem(userId: number) {
		const randomBoxPercentage = {
			сommon: 0.9,
			rare: 0.095,
			exquisite: 0.05
		}

		const randomBox = weightedRandom(randomBoxPercentage)
		console.log(randomBox)
		const box = await this.prisma.boxes.findFirst({
			where: {
				rare: randomBox[0].toUpperCase() + randomBox.slice(1)
			}
		})
		if (!box) throw new BadRequestException('Box not found')

		return {
			message: 'Random box given',
			box
		}
	}
}
