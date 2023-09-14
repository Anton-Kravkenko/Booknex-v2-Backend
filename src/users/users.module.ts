import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../prisma.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService],
	exports: [UsersService],
	imports: [ConfigModule]
})
export class UsersModule {}
