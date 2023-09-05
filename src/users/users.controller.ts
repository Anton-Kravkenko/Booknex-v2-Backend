import {
	Body,
	Controller,
	Get,
	HttpCode,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile,
	UsePipes,
	ValidationPipe
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

	@HttpCode(200)
	@Auth()
	@Get('/get-profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getById(id, {
			email: true,
			likedBooks: true,
			finishBooks: true,
			readingBooks: true
		})
	}

	//TODO: сделать добавление картинки профиля своей
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
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

	@HttpCode(200)
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
