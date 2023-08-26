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
			buyBooks: true,
			inventory: true
		})
	}
	//TODO: сделать добавление в избранное и много другое
	@HttpCode(200)
	@Auth()
	@Patch('/toggle-favorite/:id')
	async toggleFavorite(
		@CurrentUser('id') userId: number,
		@Param('id') id: number
	) {
		return this.usersService.toggleFavorite(userId, id)
	}
	//TODO: сделать добавление картинки профиля своей
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/update-user')
	async updateUser(@CurrentUser('id') id, @Body() dto: UserUpdateDto) {
		return this.usersService.updateUser(id, dto)
	}
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/:count')
	async changeMarks(@CurrentUser('id') id, @Param() param: { count: number }) {
		return this.usersService.changeMarks(id, +param.count)
	}
}
