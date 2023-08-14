import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from '../prisma.service'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { UserUpdateDto } from './dto/user.update.dto'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				...selectObject
			}
		})
		if (!user) throw new BadRequestException('User not found')
		return user
	}

	async updateUser(userId: number, dto: UserUpdateDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (!isSameUser) throw new BadRequestException('User not found')

		if (isSameUser && isSameUser.id !== userId)
			throw new BadRequestException('User with this email already exists')

		const user = await this.getById(userId, {
			password: false
		})
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				email: dto.email ? dto.email : user.email,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
		return this.getById(userId)
	}

	async toggleFavorite(userId: number, id: number) {
		const user = await this.getById(+userId, {
			likedBooks: true
		})
		if (!user) return new BadRequestException('User not found')

		const isFavorite = user.likedBooks.some(item => item.id === +id)
		await this.prisma.user.update({
			where: { id: +userId },
			data: {
				likedBooks: {
					[isFavorite ? 'disconnect' : 'connect']: { id: +id }
				}
			}
		})
		return {
			id: id,
			isFavorite: `${!isFavorite}`
		}
	}
}
