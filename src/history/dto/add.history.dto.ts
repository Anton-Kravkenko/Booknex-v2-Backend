import { ArrayMinSize, IsArray } from 'class-validator'

export class AddHistoryDto {
	@IsArray()
	@ArrayMinSize(1)
	history: {
		time: number
		bookId: number
	}[]
}
