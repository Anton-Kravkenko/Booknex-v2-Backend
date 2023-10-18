import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash, verify } from 'argon2'
import { returnBookObject } from '../book/return.book.object'
import { PrismaService } from '../prisma.service'
import { returnShelfObject } from '../shelf/return.shelf.object'
import { UserUpdateBioDto, UserUpdatePasswordDto } from './dto/user.update.dto'
import { returnUserObject } from './return.user.object'
import {
	CatalogTitleType,
	DesignationType,
	idSelect,
	UserLibraryCatalogType,
	UserLibraryCategoryType,
	userLibraryFields,
	UserLibraryFieldsEnum,
	UserOppositeToggle,
	UserStatisticsType
} from './user.types'

@Injectable()
export class UserService {
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

	async library(id: number) {
		const library = await this.getUserById(id, {
			email: false,
			name: false,
			id: false,
			createdAt: false,
			updatedAt: false,
			_count: {
				select: {
					finishedBooks: true,
					readingBooks: true,
					watchedShelves: true,
					hiddenShelves: true
				}
			}
		})
		return {
			books: [
				{
					name: CatalogTitleType.readingBooks,
					type: UserLibraryFieldsEnum.readingBooks,
					icon: 'book',
					count: library._count.readingBooks
				},
				{
					name: CatalogTitleType.finishedBooks,
					type: UserLibraryFieldsEnum.finishedBooks,
					icon: 'checklist',
					count: library._count.finishedBooks
				}
			] as UserLibraryCatalogType[],
			shelves: [
				{
					name: CatalogTitleType.watchedShelves,
					type: UserLibraryFieldsEnum.watchedShelves,
					icon: 'eye',
					count: library._count.watchedShelves
				},
				{
					name: CatalogTitleType.hiddenShelves,
					type: UserLibraryFieldsEnum.hiddenShelves,
					icon: 'eye-closed',
					count: library._count.hiddenShelves
				}
			] as UserLibraryCatalogType[]
		}
	}

	async libraryByType(id: number, type: UserLibraryCategoryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		const elements = await this.getUserById(id, {
			[type]: {
				select:
					DesignationType[type] === 'book'
						? returnBookObject
						: {
								...returnShelfObject,
								description: true
						  },
				orderBy: {
					createdAt: 'desc'
				}
			}
		})
		return {
			title: CatalogTitleType[type],
			[type]: elements[type]
		}
	}

	async profile(id: number) {
		const user = await this.getUserById(id, {
			...returnUserObject,
			picture: true
		})

		const {
			_sum: { time: totalTime }
		} = await this.prisma.history.aggregate({
			where: { userId: id },
			_sum: { time: true }
		})

		const {
			_count: { id: bookCount },
			_sum: { pages: totalPageCount }
		} = await this.prisma.book.aggregate({
			where: { finishedBy: { some: { id } } },
			_count: { id: true },
			_sum: { pages: true }
		})

		const statistics: UserStatisticsType[] = [
			{
				name: 'Books read',
				icon: 'book',
				count: bookCount ?? 0
			},
			{
				name: 'Pages read',
				icon: 'log',
				count: totalPageCount ?? 0
			},
			{
				name: 'Time in read',
				icon: 'hourglass',
				count: `${Math.floor(totalTime / 3_600_000)}h ${Math.floor(
					(totalTime % 3_600_000) / 60_000
				)}min`
			},
			{
				name: 'Reading speed',
				icon: 'zap',
				count:
					totalPageCount && totalTime
						? `${Math.floor(
								totalPageCount / (totalTime / 3_600_000)
						  )} pages/hour`
						: 'unknown'
			}
		]
		return {
			...user,
			statistics
		}
	}

	async updatePassword(userId: number, dto: UserUpdatePasswordDto) {
		const user = await this.getUserById(userId, {
			password: true
		})
		const isPasswordValid = await verify(user.password, dto.oldPassword)
		if (!isPasswordValid)
			throw new BadRequestException('Invalid password').getResponse()
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				password: await hash(dto.password)
			}
		})
	}

	async updatePicture(userId: number, fileName: string) {
		await this.getUserById(userId, {
			picture: true
		})
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				picture: fileName
			}
		})
		return this.getUserById(userId)
	}

	async updateBio(userId: number, dto: UserUpdateBioDto) {
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
				name: dto.name ?? user.name
			}
		})
		return this.getUserById(userId)
	}

	async all(cursorId: number) {
		return this.prisma.user.findMany({
			take: 20,
			cursor: cursorId && { id: cursorId },
			select: {
				...returnUserObject,
				_count: {
					select: {
						finishedBooks: true,
						readingBooks: true,
						watchedShelves: true,
						hiddenShelves: true
					}
				}
			}
		})
	}

	async delete(id: number) {
		const user = await this.getUserById(id)
		await this.prisma.user.delete({
			where: { id: user.id }
		})
	}

	async favoriteList(userId: number) {
		return this.getUserById(+userId, {
			readingBooks: idSelect,
			finishedBooks: idSelect,
			watchedShelves: idSelect,
			hiddenShelves: idSelect
		})
	}

	async toggle(userId: number, id: number, type: UserLibraryCategoryType) {
		if (!userLibraryFields.includes(type))
			throw new BadRequestException('Invalid type').getResponse()
		const existBookOrShelf = await this.prisma[
			DesignationType[type] as 'book'
		].findFirst({
			where: { id },
			select: { id: true }
		})
		if (!existBookOrShelf)
			throw new NotFoundException(`${DesignationType[type]} not found`)

		const user = await this.getUserById(+userId, {
			readingBooks: idSelect,
			finishedBooks: idSelect,
			watchedShelves: idSelect,
			hiddenShelves: idSelect
		})

		const isExist = user[type].some(book => book.id === id)
		const isOppositeExist = user[UserOppositeToggle[type]].some(
			book => book.id === id
		)
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				[type]: {
					[isExist ? 'disconnect' : 'connect']: {
						id
					}
				},
				...(isOppositeExist && {
					[UserOppositeToggle[type]]: {
						disconnect: {
							id
						}
					}
				})
			}
		})
		return {
			message: `${DesignationType[type]} ${
				isExist ? 'removed from' : 'added to'
			} your ${CatalogTitleType[type].toLowerCase()} list`,
			isExist: !isExist
		}
	}
}
