import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { BookService } from './book.service'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@HttpCode(200)
	@Auth()
	@Post('/buy/:id')
	async buyBook(@CurrentUser('id') userId, @Param('id') bookId: number) {
		return this.bookService.buyBook(+userId, +bookId)
	}
	@Post('/review/:id')
	@Auth()
	@HttpCode(200)
	async reviewBook(@CurrentUser('id') id, @Param('id') bookId: number) {
		return this.bookService.reviewBook(+id, +bookId)
	}
	@Get('/:id')
	@HttpCode(200)
	async getBookInfoById(@Param('id') id: number) {
		return this.bookService.getBookInfoById(+id)
	}
}
