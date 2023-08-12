import { ArrayMinSize, IsArray, IsNumber } from 'class-validator'

export class AddHistoryDto {
	@IsArray()
	@IsNumber()
	@ArrayMinSize(1)
	bookIds: number[]
}