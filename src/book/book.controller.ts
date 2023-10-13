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
	async review(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string,
		@Body() dto: ReviewBookDto
	) {
		return this.bookService.review(+userId, +bookId, dto)
	}

	@Get('/emotions')
	@Auth()
	async emotions() {
		return this.bookService.emotions()
	}

	@Auth()
	@Get('by-id/:id')
	async infoById(@Param('id') bookId: string) {
		return this.bookService.infoById(+bookId)
	}

	//  admin

	@Auth('admin')
	@Get('/all')
	async all() {
		return this.bookService.all()
	}

	@Auth('admin')
	@Post('/create')
	async create(@Body() dto: CreateBookDto) {
		return this.bookService.create(dto)
	}

	@Auth('admin')
	@Put('/update/:id')
	async update(@Param('id') bookId: string, @Body() dto: EditBookDto) {
		return this.bookService.update(+bookId, dto)
	}

	@Auth('admin')
	@Delete('/delete/:id')
	async delete(@Param('id') bookId: string) {
		return this.bookService.delete(+bookId)
	}
}
