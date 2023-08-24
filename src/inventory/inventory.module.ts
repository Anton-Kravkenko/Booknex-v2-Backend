import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'

@Module({
	controllers: [InventoryController],
	providers: [InventoryService, PrismaService, UsersService]
})
export class InventoryModule {}
