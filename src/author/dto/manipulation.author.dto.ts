import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreateAuthorDto {
	@IsString() name: string
	@IsString() description: string
	@IsString() picture: string
	@IsArray() books: number[]
}
export class EditAuthorDto {
	@IsString() @IsOptional() name: string
	@IsString() @IsOptional() description: string
	@IsString() @IsOptional() picture: string
	@IsArray() @IsOptional() books: number[]
}
