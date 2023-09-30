import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { CreateShelfDto } from './dto/create-shelf.dto'
import { UpdateShelfDto } from './dto/update-shelf.dto'

@Injectable()
export class ShelvesService {
	// TODo: сделать всё эти запросы, дела на 10 мин
	constructor(private readonly prisma: PrismaService) {}

	async getShelves(userId: number) {}

	async getShelfById(shelfId: string) {}

	async toggle(
		userId: number,
		id: number,
		type: keyof Pick<Prisma.UserSelect, 'likedShelves' | 'unwatchedShelves'>
	) {}

	async createShelf(dto: CreateShelfDto) {}

	async deleteShelf(id: number) {}

	async updateShelf(id: number, dto: UpdateShelfDto) {}
}
