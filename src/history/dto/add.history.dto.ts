import { ArrayMinSize, IsArray, IsNumber } from 'class-validator'

export class AddHistoryDto {
	@IsNumber()
	time: number

	@IsArray()
	@IsNumber()
	@ArrayMinSize(1)
	bookIds: number[]
}
