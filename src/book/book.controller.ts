import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { BookService } from './book.service'
import { CreateBookDto, EditBookDto } from './dto/manipulation.book.dto'
import { ReviewBookDto } from './dto/review.book.dto'

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

	@Get('/emotions')
	@Auth()
	async getEmotions() {
		return this.bookService.getEmotions()
	}

	@Auth()
	@Get('by-id/:id')
	async getBookInfoById(@Param('id') bookId: string) {
		return this.bookService.getBookInfoById(+bookId)
	}

	//  admin

	@Auth('admin')
	@Get('/all')
	async getAllBooks() {
		return this.bookService.getAllBooks()
	}

	@Auth('admin')
	@Post('/create')
	async createBook(@Body() dto: CreateBookDto) {
		return this.bookService.createBook(dto)
	}

	@Auth('admin')
	@Put('/update/:id')
	async updateBook(@Param('id') bookId: string, @Body() dto: EditBookDto) {
		return this.bookService.updateBook(+bookId, dto)
	}

	@Auth('admin')
	@Delete('/delete/:id')
	async deleteBook(@Param('id') bookId: string) {
		return this.bookService.deleteBook(+bookId)
	}
}
