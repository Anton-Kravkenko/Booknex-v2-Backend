import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from '../prisma.service'
import { returnShelvesObject } from '../utils/return-object/return-shelves-object'
import { returnBookObject } from '../utils/return-object/return.book.object'
import { returnUserObject } from '../utils/return-object/return.user.object'
import { UserUpdateDto } from './dto/user.update.dto'
import {
	DesignationType,
	userLibraryFields,
	UserLibraryType
} from './user-types'

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
					finishBooks: true,
					likedBooks: true,
					readingBooks: true,
					likeShelves: true,
					unWatchedShelves: true
				}
			}
		})
		return {
			'Finished books': library._count.finishBooks,
			'Liked books': library._count.likedBooks,
			'Reading Books': library._count.readingBooks,
			'Liked Shelves': library._count.likeShelves,
			'UnWatched Shelves': library._count.unWatchedShelves
		}
	}

	async getLibraryByType(id: number, type: UserLibraryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		// TODO: сделать более адаптивно эту тему, а то щас может крашнуться в любой момент
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
				email: dto.email ? dto.email : user.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name ? dto.name : user.name,
				picture: dto.picture ? dto.picture : user.picture
			}
		})
		return this.getUserById(userId)
	}

	async toggle(userId: number, id: number, type: UserLibraryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
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
			finishBooks: true,
			likeShelves: true,
			unWatchedShelves: true
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
			message: `${DesignationType[type]} ${
				isExist ? 'removed from' : 'added to'
			} ${type}`
		}
	}
}
