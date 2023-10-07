import { IsNumber, IsString } from 'class-validator'

export class CreateShelfDto {
	@IsString() name: string
	@IsString() image: string
	@IsString() icon: string
	@IsNumber({}, { each: true }) books: number[]
}
