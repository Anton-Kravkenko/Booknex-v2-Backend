import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { BookService } from './book.service'
import { ReviewBookDto } from './dto/book.dto'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}
	@Post('/review/:id')
	@Auth()
	async reviewBook(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string,
		@Body() dto: ReviewBookDto
	) {
		return this.bookService.reviewBook(+userId, +bookId, dto)
	}

	@Get('/:id')
	async getBookInfoById(@Param('id') bookId: string) {
		return this.bookService.getBookInfoById(+bookId)
	}
}
