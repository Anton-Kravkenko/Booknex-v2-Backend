import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { AddHistoryDto } from './dto/add.history.dto'
import { HistoryService } from './history.service'

@Auth()
@ApiTags('history')
@ApiBearerAuth()
@Controller('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}

	@Post('/create')
	async create(
		@Body() addHistoryDto: AddHistoryDto,
		@CurrentUser('id') id: number
	) {
		return this.historyService.create(id, addHistoryDto)
	}
}
