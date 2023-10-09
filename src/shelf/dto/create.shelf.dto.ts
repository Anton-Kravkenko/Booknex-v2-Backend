import { IsNumber, IsString } from 'class-validator'

export class CreateShelfDto {
	@IsString() title: string
	@IsString() image: string
	@IsString() icon: string
	@IsNumber({}, { each: true }) books: number[]
}
