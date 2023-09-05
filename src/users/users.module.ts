import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../prisma.service'
import { UploadService } from '../upload/upload.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService, UploadService],
	exports: [UsersService],
	imports: [ConfigModule]
})
export class UsersModule {}
