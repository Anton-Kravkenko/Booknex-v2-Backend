import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from '../prisma.service'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { UserUpdateDto } from './dto/user.update.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				...selectObject
			}
		})
		if (!user) throw new NotFoundException('User not found').getResponse()
		return user
	}

	async updateUser(userId: number, dto: UserUpdateDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (!isSameUser) throw new NotFoundException('User not found').getResponse()

		if (isSameUser && isSameUser.id !== userId)
			throw new BadRequestException(
				'User with this email already exists'
			).getResponse()

		const user = await this.getUserById(userId, {
			password: false
		})
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				email: dto.email ? dto.email : user.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name ? dto.name : user.name,
				picture: dto.picture ? dto.picture : user.picture
			}
		})
		return this.getUserById(userId)
	}

	async toggle(
		userId: number,
		id: number,
		type: 'reading' | 'like' | 'finish'
	) {
		if (!['reading', 'like', 'finish'].includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		const user = await this.getUserById(+userId, {
			likedBooks: true,
			readingBooks: true,
			finishBooks: true
		})
		const typeOfBooks =
			type === 'reading'
				? 'readingBooks'
				: type === 'like'
				? 'likedBooks'
				: 'finishBooks'

		const isExist = user[typeOfBooks].some(book => book.id === id)
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				[typeOfBooks]: {
					[isExist ? 'disconnect' : 'connect']: {
						id
					}
				}
			}
		})
		return {
			message: `Book ${isExist ? 'removed from' : 'added to'} ${typeOfBooks}`
		}
	}
}
