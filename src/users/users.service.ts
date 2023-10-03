import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'
import { returnShelvesObject } from '../shelves/return.shelves.object'
import { UserUpdateDto } from './dto/user.update.dto'
import { returnUserObject } from './return.user.object'
import {
	DesignationType,
	userLibraryFields,
	UserLibraryType
} from './user.types'

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

	async getLibrary(id: number) {
		const library = await this.getUserById(id, {
			email: false,
			name: false,
			id: false,
			createdAt: false,
			updatedAt: false,
			_count: {
				select: {
					finishedBooks: true,
					likedBooks: true,
					readingBooks: true,
					likedShelves: true,
					unwatchedShelves: true
				}
			}
		})
		return [
			{
				name: 'Finished books',
				count: library._count.finishedBooks
			},
			{
				name: 'Liked books',
				count: library._count.likedBooks
			},
			{
				name: 'Reading Books',
				count: library._count.readingBooks
			},
			{
				name: 'Liked Shelves',
				count: library._count.likedShelves
			},
			{
				name: 'UnWatched Shelves',
				count: library._count.unwatchedShelves
			}
		]
	}

	async getLibraryByType(id: number, type: UserLibraryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		const books = await this.getUserById(id, {
			[type]: {
				select:
					DesignationType[type] === 'Book'
						? returnBookObject
						: returnShelvesObject,
				orderBy: {
					createdAt: 'desc'
				}
			}
		})
		return books[type]
	}

	async getProfile(id: number) {
		return this.getUserById(id, {
			...returnUserObject,
			picture: true
		})
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
				email: dto.email ?? user.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name ?? user.name,
				picture: dto.picture ?? user.picture
			}
		})
		return this.getUserById(userId)
	}

	async getAllUsers() {
		return this.prisma.user.findMany({
			select: {
				...returnUserObject,
				_count: {
					select: {
						finishedBooks: true,
						likedBooks: true,
						readingBooks: true,
						likedShelves: true,
						unwatchedShelves: true
					}
				}
			}
		})
	}

	async deleteUser(id: number) {
		const user = await this.getUserById(id)
		await this.prisma.user.delete({
			where: { id: user.id }
		})
	}

	async toggle(userId: number, id: number, type: UserLibraryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
		const existBookOrShelf = await this.prisma[DesignationType[type]].findFirst(
			{
				where: { id },
				select: { id: true }
			}
		)
		if (!existBookOrShelf)
			throw new NotFoundException(`${DesignationType[type]} not found`)

		const user = await this.getUserById(+userId, {
			likedBooks: true,
			readingBooks: true,
			finishedBooks: true,
			likedShelves: true,
			unwatchedShelves: true
		})

		const isExist = user[type].some(book => book.id === id)

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				[type]: {
					[isExist ? 'disconnect' : 'connect']: {
						id
					}
				}
			}
		})
		return {
			isExist: !isExist
		}
	}
}
