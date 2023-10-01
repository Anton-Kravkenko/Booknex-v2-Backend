import { IsString } from 'class-validator'

export class ReviewBookDto {
	@IsString()
	emotion: string

	@IsString({ each: true })
	tags: string[]

	@IsString()
	comment: string
}
