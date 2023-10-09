import { Body, Controller, Post } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { AddHistoryDto } from './dto/add.history.dto'
import { HistoryService } from './history.service'

@Auth()
@Controller('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}

	@Post('/create')
	async addHistory(
		@Body() addHistoryDto: AddHistoryDto,
		@CurrentUser('id') id: number
	) {
		return this.historyService.addHistory(id, addHistoryDto)
	}
}
