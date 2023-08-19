import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CatalogModule } from './catalog/catalog.module'
import { HistoryModule } from './history/history.module'
import { UsersModule } from './users/users.module'
import { WalletModule } from './wallet/wallet.module'

@Module({
	imports: [
		UsersModule,
		AuthModule,
		CatalogModule,
		HistoryModule,
		WalletModule
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
