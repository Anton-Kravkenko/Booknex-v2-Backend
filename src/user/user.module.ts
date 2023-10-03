import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService],
	imports: [ConfigModule]
})
export class UserModule {}
