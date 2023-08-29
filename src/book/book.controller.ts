import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { BookService } from './book.service'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@Post('/review/:id')
	@Auth()
	@HttpCode(200)
	async reviewBook(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string
	) {
		return this.bookService.reviewBook(+userId, +bookId)
	}
	@Get('/:id')
	@HttpCode(200)
	async getBookInfoById(@Param('id') bookId: string) {
		return this.bookService.getBookInfoById(+bookId)
	}
}
