import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateBookDto {
	@IsString() title: string
	@IsObject()
	author: {
		name: string
		picture: string
	}

	@IsString() description: string
	@IsString() isbn: string
	@IsString() picture: string
	@IsString() epub: string
	@IsNumber() pages: number
	@IsNumber() likedPercentage: number
	@IsNumber() popularity: number
	@IsString() majorGenre: string
	@IsString({ each: true }) genres: string[]
}
export class EditBookDto {
	@IsString() @IsOptional() title: string
	@IsString() @IsOptional() author: string
	@IsString() @IsOptional() description: string
	@IsString() @IsOptional() isbn: string
	@IsString() @IsOptional() image: string
	@IsString() @IsOptional() epub: string
	@IsNumber() @IsOptional() pages: number
	@IsNumber() @IsOptional() likedPercentage: number
	@IsNumber() @IsOptional() popularity: number
	@IsString() @IsOptional() majorGenre: string
	@IsString({ each: true }) @IsOptional() genres: string[]
}
