import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query
} from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { FilenameDto } from '../storage/dto/upload.dto'
import { UserUpdateBioDto, UserUpdatePasswordDto } from './dto/user.update.dto'
import { UserService } from './user.service'
import { UserLibraryCategoryType } from './user.types'

@Controller('user')
export class UserController {
	constructor(private readonly usersService: UserService) {}
	@Auth()
	@Get('/profile')
	async profile(@CurrentUser('id') id: number) {
		return this.usersService.profile(+id)
	}

	@Auth()
	@Get('/library')
	async library(@CurrentUser('id') id: number) {
		return this.usersService.library(+id)
	}

	@Auth()
	@Get('/library/:type')
	async libraryByType(
		@CurrentUser('id') id: number,
		@Param('type')
		type: UserLibraryCategoryType
	) {
		return this.usersService.libraryByType(+id, type)
	}

	@Auth()
	@Post('/update-bio')
	async updateBio(
		@CurrentUser('id') id: number,
		@Body() dto: UserUpdateBioDto
	) {
		return this.usersService.updateBio(+id, dto)
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
		type: UserLibraryCategoryType
	) {
		return this.usersService.toggle(userId, +id, type)
	}

	// admin

	@Auth('admin')
	@Get('/all')
	async all(@Query('cursor') cursorId: number) {
		return this.usersService.all(+cursorId || undefined)
	}

	@Auth('admin')
	@Delete('/delete/:id')
	async delete(@Param('id') id: string) {
		return this.usersService.delete(+id)
	}
}
