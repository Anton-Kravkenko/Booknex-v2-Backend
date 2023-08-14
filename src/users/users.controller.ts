import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { UserUpdateDto } from './dto/user.update.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@Auth()
	@Get('/get-profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getById(id, {
			email: true,
			likedBooks: true,
			bookMarks: true,
			readBooks: true,
			readingBooks: true,
			buyBooks: true
		})
	}

	@HttpCode(200)
	@Auth()
	@Patch('/toggle-favorite/:id')
	async toggleFavorite(
		@CurrentUser('id') userId: number,
		@Param('id') id: number
	) {
		return this.usersService.toggleFavorite(userId, id)
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/update-user')
	async updateUser(@CurrentUser('id') id, @Body() dto: UserUpdateDto) {
		return this.usersService.updateUser(id, dto)
	}
	// TODO: сделать пополнение таймера чтения
}
