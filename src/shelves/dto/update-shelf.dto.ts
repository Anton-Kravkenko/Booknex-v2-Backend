import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateShelfDto {
	@IsOptional() @IsString() name: string
	@IsOptional() @IsString() picture: string
	@IsOptional() @IsNumber({}, { each: true }) books: number[]
}
