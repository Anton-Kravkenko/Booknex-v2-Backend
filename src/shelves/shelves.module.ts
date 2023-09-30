import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ShelvesController } from './shelves.controller'
import { ShelvesService } from './shelves.service'

@Module({
	controllers: [ShelvesController],
	providers: [ShelvesService, PrismaService]
})
export class ShelvesModule {}
