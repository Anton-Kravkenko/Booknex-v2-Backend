import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { AddHistoryDto } from './dto/add.history.dto'
import { HistoryService } from './history.service'

@Controller('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	@Get()
	@Auth()
	async getHistory(@CurrentUser('id') id: number) {
		return this.historyService.getUserHistory(id)
	}

	@Get('/book/:id')
	@Auth()
	async getHistoryByBookId(@Param('id') id: number) {
		return this.historyService.getHistoryByBookId(id)
	}

	@Post('/add')
	@Auth()
	async addHistory(
		@Body() addHistoryDto: AddHistoryDto,
		@CurrentUser('id') id: number
	) {
		return this.historyService.addHistory(id, addHistoryDto)
	}
}
