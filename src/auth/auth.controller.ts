import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthDto, RefreshDto, RegisterDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Put('/check-email/:email')
	async checkEmail(@Param('email') email: string) {
		return this.authService.checkEmail(email)
	}

	@Post('/register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@Post('/login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}

	@Post('/access-token')
	async refreshToken(@Body() dto: RefreshDto) {
		return this.authService.refresh(dto.refreshToken)
	}
}
