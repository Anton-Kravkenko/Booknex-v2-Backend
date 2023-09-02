import { IsString } from 'class-validator'

export class ReviewBookDto {
	@IsString()
	emotion: string[]

	@IsString()
	comment: string
}

