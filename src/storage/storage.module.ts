import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'

@Module({
	controllers: [StorageController],
	providers: [StorageService],
	imports: [ConfigModule]
})
export class StorageModule {}
