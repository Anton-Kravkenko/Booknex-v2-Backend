import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { BookService } from './book.service'
import { CreateBookDto, EditBookDto } from './dto/manipulation-book.dto'
import { ReviewBookDto } from './dto/review-book.dto'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}
	@Get('/emotions')
	async getEmotions() {
		return this.bookService.getEmotions()
	}

	@Post('/review/:id')
	@Auth()
	async reviewBook(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string,
		@Body() dto: ReviewBookDto
	) {
		return this.bookService.reviewBook(+userId, +bookId, dto)
	}

	@Auth()
	@Get('/:id')
	async getBookInfoById(@Param('id') bookId: string) {
		return this.bookService.getBookInfoById(+bookId)
	}
	// admin

	@Auth('admin')
	@Get('/get-all-books')
	async getAllBooks() {
		return this.bookService.getAllBooks()
	}

	@Auth('admin')
	@Get('/create')
	async createBook(@Body() dto: CreateBookDto) {
		return this.bookService.createBook(dto)
	}

	@Auth('admin')
	@Get('/update/:id')
	async updateBook(@Param('id') bookId: string, @Body() dto: EditBookDto) {
		return this.bookService.updateBook(+bookId, dto)
	}

	@Auth('admin')
	@Get('/delete/:id')
	async deleteBook(@Param('id') bookId: string) {
		return this.bookService.deleteBook(+bookId)
	}
}
