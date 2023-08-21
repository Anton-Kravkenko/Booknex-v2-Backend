import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class BookService {
	constructor(
		private readonly usersService: UsersService,
		private readonly prisma: PrismaService
	) {}
	async buyBook(userId: number, id: number, price: number) {
		const user = await this.usersService.getById(+userId, {
			buyBooks: true,
			bookMarks: true
		})
		if (!user) return new BadRequestException('User not found')
		const isBought = user.buyBooks.some(item => item.id === +id)
		if (isBought) return new BadRequestException('You already bought this book')
		if (user.bookMarks - price < 0)
			return new BadRequestException('You dont have enough money')
		await this.prisma.user.update({
			where: { id: +userId },
			data: {
				bookMarks: +user.bookMarks - price,
				buyBooks: {
					connect: { id: +id }
				}
			}
		})
		return {
			message: 'Success',
			bookMarks: user.bookMarks - price
		}
	}
}
