import { IsNumber } from 'class-validator'

export class BuyBookDto {
	@IsNumber()
	bookId: number
	@IsNumber()
	price: number
}