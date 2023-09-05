import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
	controllers: [UploadController],
	providers: [UploadService],
	imports: [ConfigModule]
})
export class UploadModule {}
