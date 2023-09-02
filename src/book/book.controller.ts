import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CurrentUser } from '../decorator/user.decorator'
import { Auth } from '../guard/auth.decorator'
import { BookService } from './book.service'
import { ReviewBookDto } from './dto/book.dto'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}
	@Post('/review/:id')
	@Auth()
	@HttpCode(200)
	async reviewBook(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string,
		@Body() dto: ReviewBookDto
	) {
		return this.bookService.reviewBook(+userId, +bookId, dto)
	}

	@Get('/:id')
	@HttpCode(200)
	async getBookInfoById(@Param('id') bookId: string) {
		return this.bookService.getBookInfoById(+bookId)
	}
}
