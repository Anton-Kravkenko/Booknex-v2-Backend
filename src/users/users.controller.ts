import {
	Body,
	Controller,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile
} from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { UploadService } from '../upload/upload.service'
import { UserUpdateDto } from './dto/user.update.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly uploadService: UploadService
	) {}

	@Auth()
	@Get('/get-profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getUserById(id, {
			email: true,
			isAdmin: true,
			name: true,
			picture: true,
			likedBooks: true,
			finishBooks: true,
			readingBooks: true
		})
	}

	@Auth()
	@Post('/update-user')
	async updateUser(
		@CurrentUser('id') id: number,
		@Body() dto: UserUpdateDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 10000000
					})
				]
			})
		)
		file: Express.Multer.File
	) {
		const imageLink = await this.uploadService.upload(
			file.buffer,
			file.originalname,
			'image'
		)
		return this.usersService.updateUser(+id, dto, imageLink.url)
	}

	@Auth()
	@Patch('/toggle/:type/:id')
	async toggle(
		@CurrentUser('id') userId: number,
		@Param('id') id: string,
		@Param('type') type: 'reading' | 'like' | 'finish'
	) {
		return this.usersService.toggle(userId, +id, type)
	}
}
