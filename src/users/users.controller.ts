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
import { CurrentUser } from '../decorator/user.decorator'
import { Auth } from '../guard/auth.decorator'
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
			readBooks: true,
			readingBooks: true,
			buyBooks: true
		})
	}
	//TODO: сделать добавление в избранное и много другое
	@HttpCode(200)
	@Auth()
	@Patch('/toggle-favorite/:id')
	async toggleFavorite(
		@CurrentUser('id') userId: number,
		@Param('id') id: string
	) {
		return this.usersService.toggleFavorite(userId, +id)
	}
	//TODO: сделать добавление картинки профиля своей
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/update-user')
	async updateUser(@CurrentUser('id') id: number, @Body() dto: UserUpdateDto) {
		return this.usersService.updateUser(+id, dto)
	}
}
