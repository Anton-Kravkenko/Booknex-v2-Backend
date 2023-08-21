import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { BookController } from './book.controller'
import { BookService } from './book.service'

@Module({
	controllers: [BookController],
	providers: [BookService, PrismaService, UsersService]
})
export class BookModule {}
