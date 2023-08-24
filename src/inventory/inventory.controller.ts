import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { InventoryService } from './inventory.service'

@Controller('inventory')
export class InventoryController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Get('/random')
	@Auth()
	@HttpCode(200)
	async randomItem(@CurrentUser('id') userId: number) {
		return this.inventoryService.randomItem(+userId)
	}

	@Post('/open/:id')
	@Auth()
	@HttpCode(200)
	async openBox(@CurrentUser('id') userId, @Param('id') id: number) {
		return this.inventoryService.openBox(+userId, +id)
	}
	@Post('/buy/:id')
	@Auth()
	@HttpCode(200)
	async buyBox(@CurrentUser('id') userId, @Param('id') id: number) {
		return this.inventoryService.buyBox(+userId, +id)
	}
}
