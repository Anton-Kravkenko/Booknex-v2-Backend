import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { BookService } from './book.service'
import { CreateBookDto, EditBookDto } from './dto/manipulation.book.dto'
import { ReviewBookDto } from './dto/review.book.dto'

@ApiTags('book')
@ApiBearerAuth()
@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}
	@Auth('admin')
	@Post('/create')
	async create(@Body() dto: CreateBookDto) {
		return this.bookService.create(dto)
	}

	@Get('/emotions')
	@Auth()
	async emotions() {
		return this.bookService.emotions()
	}

	@Post('/review/:id')
	@Auth()
	async review(
		@CurrentUser('id') userId: number,
		@Param('id') bookId: string,
		@Body() dto: ReviewBookDto
	) {
		return this.bookService.review(+userId, +bookId, dto)
	}

	@Auth()
	@Get('by-id/:id')
	async infoById(@Param('id') bookId: string) {
		return this.bookService.infoById(+bookId)
	}

	@Auth()
	@Get('by-id/:id/reviews')
	async reviewsById(
		@Param('id') bookId: string,
		@Query('cursor') cursorId: number
	) {
		return this.bookService.reviewsById(+bookId, +cursorId || undefined)
	}

	//  admin

	@Auth('admin')
	@Get('/all')
	async all(@Query('cursor') cursorId: number) {
		return this.bookService.all(+cursorId || undefined)
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
