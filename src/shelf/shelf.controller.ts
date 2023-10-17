import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { CreateShelfDto } from './dto/create.shelf.dto'
import { UpdateShelfDto } from './dto/update.shelf.dto'
import { ShelfService } from './shelf.service'

@ApiTags('shelf')
@ApiBearerAuth()
@Controller('shelf')
export class ShelfController {
	constructor(private readonly shelvesService: ShelfService) {}
	@Get('/catalog')
	@Auth()
	async catalog(@CurrentUser('id') userId: number) {
		return this.shelvesService.catalog(userId)
	}

	@Get('/by-id/:id')
	@Auth()
	async byId(@Param('id') shelfId: number) {
		return this.shelvesService.infoById(+shelfId)
	}

	// admin
	@Get('/all')
	@Auth('admin')
	async all(@Query('cursor') cursorId: number) {
		return this.shelvesService.all(+cursorId || undefined)
	}

	@Post('/create')
	@Auth('admin')
	async create(@Body() dto: CreateShelfDto) {
		return this.shelvesService.create(dto)
	}

	@Delete('/delete/:id')
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.shelvesService.delete(+id)
	}

	@Put('/update/:id')
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateShelfDto) {
		return this.shelvesService.update(+id, dto)
	}
}
