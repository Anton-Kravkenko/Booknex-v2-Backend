import {
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { BuyBookDto } from './dto/buy.book.dto'
import { WalletService } from './wallet.service'

@Controller('wallet')
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	@HttpCode(200)
	@Auth()
	@Post('/buy-book')
	async buyBook(@CurrentUser('id') id, @Body() dto: BuyBookDto) {
		return this.walletService.buyBook(+id, +dto.bookId, +dto.price)
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/:count')
	async changeMoney(@CurrentUser('id') id, @Param() param: { count: number }) {
		return this.walletService.changeMoney(id, +param.count)
	}
	//TODO: сделать выбытие кейсов и книг
}
