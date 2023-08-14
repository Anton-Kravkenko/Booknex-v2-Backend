import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
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
