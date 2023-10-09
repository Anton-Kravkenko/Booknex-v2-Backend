import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { FilenameDto } from '../storage/dto/upload.dto'
import { UserUpdateBioDto, UserUpdatePasswordDto } from './dto/user.update.dto'
import { UserService } from './user.service'
import { UserLibraryType } from './user.types'

@Controller('user')
export class UserController {
	constructor(private readonly usersService: UserService) {}
	@Auth()
	@Get('/profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getProfile(+id)
	}

	@Auth()
	@Get('/library')
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
	@Post('/update-bio')
	async updateUserBio(
		@CurrentUser('id') id: number,
		@Body() dto: UserUpdateBioDto
	) {
		return this.usersService.updateUserBio(+id, dto)
	}

	@Auth()
	@Post('/update-password')
	async updatePassword(
		@CurrentUser('id') id: number,
		@Body() dto: UserUpdatePasswordDto
	) {
		return this.usersService.updatePassword(+id, dto)
	}

	@Auth()
	@Post('/update-picture')
	async updatePicture(@CurrentUser('id') id: number, @Body() dto: FilenameDto) {
		return this.usersService.updatePicture(+id, dto.filename)
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

	// admin

	@Auth('admin')
	@Get('/all')
	async getAllUsers() {
		return this.usersService.getAllUsers()
	}

	@Auth('admin')
	@Delete('/delete/:id')
	async deleteUser(@Param('id') id: string) {
		return this.usersService.deleteUser(+id)
	}
}
