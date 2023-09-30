import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { UserUpdateDto } from './dto/user.update.dto'
import { UserLibraryType } from './user-types'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Auth()
	@Get('/get-profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getProfile(+id)
	}

	@Auth()
	@Get('/get-library')
	async getLibrary(@CurrentUser('id') id: number) {
		return this.usersService.getLibrary(+id)
	}

	@Auth()
	@Get('/library/:type')
	async getLibraryByType(
		@CurrentUser('id') id: number,
		@Param('type')
		type: UserLibraryType
	) {
		return this.usersService.getLibraryByType(+id, type)
	}

	@Auth()
	@Post('/update-user')
	async updateUser(@CurrentUser('id') id: number, @Body() dto: UserUpdateDto) {
		return this.usersService.updateUser(+id, dto)
	}

	@Auth()
	@Patch('/toggle/:type/:id')
	async toggle(
		@CurrentUser('id') userId: number,
		@Param('id') id: string,
		@Param('type')
		type: UserLibraryType
	) {
		return this.usersService.toggle(userId, +id, type)
	}
}
