import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { BookService } from './book.service'
import { BuyBookDto } from './dto/buy.book.dto'

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@HttpCode(200)
	@Auth()
	@Post('/buy-book')
	async buyBook(@CurrentUser('id') id, @Body() dto: BuyBookDto) {
		return this.bookService.buyBook(+id, +dto.bookId, +dto.price)
	}
}
