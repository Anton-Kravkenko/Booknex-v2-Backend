import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CurrentUser } from '../decorator/user.decorator'
import { Auth } from '../guard/auth.decorator'
import { AddHistoryDto } from './dto/add.history.dto'
import { HistoryService } from './history.service'

@Controller('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	@Get()
	@Auth()
	@HttpCode(200)
	async getHistory(@CurrentUser('id') id: number) {
		return this.historyService.getHistory(id)
	}

	@Get('/book/:id')
	@Auth()
	@HttpCode(200)
	async getHistoryByBookId(@Param('id') id: number) {
		return this.historyService.getHistoryByBookId(id)
	}
	@Post('/add')
	@Auth()
	@HttpCode(200)
	async addHistory(
		@Body() addHistoryDto: AddHistoryDto,
		@CurrentUser('id') id: number
	) {
		return this.historyService.addHistory(id, addHistoryDto)
	}
}
