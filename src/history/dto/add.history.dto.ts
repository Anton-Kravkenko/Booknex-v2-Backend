import { ArrayMinSize, IsArray } from 'class-validator'

export class AddHistoryDto {
	@IsArray()
	@ArrayMinSize(1)
	histories: {
		time: number
		bookId: number
	}[]
}
