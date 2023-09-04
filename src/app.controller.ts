import {
	Controller,
	HttpCode,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('/upload')
	@HttpCode(200)
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
		file: Express.Multer.File
	) {
		return this.appService.upload(file.buffer, file.originalname)
	}
}
