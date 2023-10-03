import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ShelfController } from './shelf.controller'
import { ShelfService } from './shelf.service'

@Module({
	controllers: [ShelfController],
	providers: [ShelfService, PrismaService]
})
export class ShelfModule {}
