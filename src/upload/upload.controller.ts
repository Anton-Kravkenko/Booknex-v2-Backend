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
import { FilenameDto, ReplacementDto } from './dto/upload.dto'
import { StorageFolderType } from './global.types'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}
	@Post('/upload/:folder')
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
		@Param('folder') folder: StorageFolderType
	) {
		return this.uploadService.upload(file.buffer, file.originalname, folder)
	}

	@Post('/delete')
	async delete(@Body() dto: FilenameDto) {
		return this.uploadService.delete(dto.filename)
	}

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
		@Body() dto: ReplacementDto
	) {
		await this.uploadService.delete(dto.deleteFilename).then(() => {
			return this.uploadService.upload(
				file.buffer,
				file.originalname,
				dto.folder
			)
		})
	}
}
