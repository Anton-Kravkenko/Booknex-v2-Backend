import {
	Body,
	Controller,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { FilenameDto, ReplacementDto } from './dto/upload.dto'
import { StorageService } from './storage.service'
import { StorageFolderType } from './storage.types'

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
	constructor(private readonly uploadService: StorageService) {}
	@Auth()
	@Post('/delete')
	async delete(@Body() dto: FilenameDto) {
		return this.uploadService.delete(dto.filename)
	}

	@Auth()
	@Post('/replacement')
	@UseInterceptors(FileInterceptor('file'))
	async replacement(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 10_000_000
					})
				]
			})
		)
		file: Express.Multer.File,
		@CurrentUser('isAdmin') isAdmin: boolean,
		@Body() dto: ReplacementDto
	) {
		await this.uploadService.delete(dto.deleteFilename)

		return this.uploadService.upload({
			file: file.buffer,
			filename: file.originalname,
			folder: dto.folder,
			isAdmin
		})
	}

	@Post('/:folder')
	@Auth()
	@UseInterceptors(FileInterceptor('file'))
	async upload(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 10_000_000
					})
				]
			})
		)
		file: Express.Multer.File,
		@Param('folder') folder: StorageFolderType,
		@CurrentUser('isAdmin') isAdmin: boolean
	) {
		return this.uploadService.upload({
			file: file.buffer,
			filename: file.originalname,
			folder,
			isAdmin
		})
	}
}
