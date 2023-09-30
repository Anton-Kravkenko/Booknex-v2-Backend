import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(8, {
		message: 'Password is too short. Minimal length is 8'
	})
	@IsString()
	password: string
}
export class RegisterDto extends AuthDto {
	@IsString()
	@IsOptional()
	name: string

	@IsString({ each: true, message: 'Initial genre in user it require' })
	genres: string[]
}

export class RefreshDto {
	@IsString()
	refreshToken: string
}
