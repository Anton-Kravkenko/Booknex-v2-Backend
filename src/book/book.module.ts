import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { BookController } from './book.controller'
import { BookService } from './book.service'

@Module({
	controllers: [BookController],
	providers: [BookService, PrismaService, UserService]
})
export class BookModule {}
