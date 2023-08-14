import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
	controllers: [WalletController],
	providers: [WalletService, PrismaService, UsersService]
})
export class WalletModule {}
