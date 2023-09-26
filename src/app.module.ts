import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AdminModule } from './admin/admin.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BookModule } from './book/book.module'
import { CatalogModule } from './catalog/catalog.module'
import { GenreModule } from './genre/genre.module'
import { HistoryModule } from './history/history.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'
import { ShelvesModule } from './shelves/shelves.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		CatalogModule,
		HistoryModule,
		GenreModule,
		BookModule,
		UploadModule,
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 10
			}
		]),
		CacheModule.register({
			isGlobal: true,
			ttl: 5000,
			max: 1000
		}),
		AdminModule,
		ShelvesModule
	],
	controllers: [AppController],
	providers: [AppService, ConfigService]
})
export class AppModule {}
