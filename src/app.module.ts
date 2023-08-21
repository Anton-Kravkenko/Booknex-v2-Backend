import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BookModule } from './book/book.module'
import { CatalogModule } from './catalog/catalog.module'
import { GenreModule } from './genre/genre.module'
import { HistoryModule } from './history/history.module'
import { UsersModule } from './users/users.module'
import { BoxesModule } from './boxes/boxes.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		CatalogModule,
		HistoryModule,
		GenreModule,
		BookModule,
		BoxesModule
		// TODO: сделать кэширование
		// CacheModule.register({
		// 	store: redisStore,
		// 	host: 'localhost',
		// 	port: 6379
		// })
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
