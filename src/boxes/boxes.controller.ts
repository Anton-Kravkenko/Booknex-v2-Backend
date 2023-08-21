import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { BoxesService } from './boxes.service'

@Controller('boxes')
export class BoxesController {
	constructor(private readonly boxesService: BoxesService) {}

	@Get('/')
	async getBoxes() {
		return this.boxesService.getBoxes()
	}
	@Get('/random')
	@Auth()
	@HttpCode(200)
	async randomBox(@CurrentUser('id') userId: number) {
		return this.boxesService.randomBox(+userId)
	}
	@Get('/:id')
	@HttpCode(200)
	async getBoxInfoById(@Param('id') id: number) {
		return this.boxesService.getBoxInfoById(+id)
	}

	@Post('/open/:id')
	@Auth()
	@HttpCode(200)
	async openBox(@CurrentUser('id') userId, @Param('id') id: number) {
		return this.boxesService.openBox(+userId, +id)
	}
	@Post('/buy/:id')
	@Auth()
	@HttpCode(200)
	async buyBox(@CurrentUser('id') userId, @Param('id') id: number) {
		return this.boxesService.buyBox(+userId, +id)
	}
}
