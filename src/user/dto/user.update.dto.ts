import { IsEmail, IsOptional, MinLength } from 'class-validator'

export class UserUpdateBioDto {
	@IsEmail()
	email: string

	@IsOptional()
	name: string
}

export class UserUpdatePasswordDto {
	@MinLength(8, {
		message: 'Password is too short. Minimal length is characters'
	})
	password: string

	@MinLength(8, {
		message: 'Old Password is too short. Minimal length is characters'
	})
	oldPassword: string
}
