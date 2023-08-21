import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { BoxesController } from './boxes.controller'
import { BoxesService } from './boxes.service'

@Module({
	controllers: [BoxesController],
	providers: [BoxesService, PrismaService, UsersService]
})
export class BoxesModule {}
