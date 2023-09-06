import {
	Controller,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
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
						maxSize: 10000000
					})
				]
			})
		)
		file: Express.Multer.File,
		@Param('folder') folder: 'epub' | 'image'
	) {
		return this.uploadService.upload(file.buffer, file.originalname, folder)
	}
}
