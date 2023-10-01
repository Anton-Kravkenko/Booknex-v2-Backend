import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { CreateShelfDto } from './dto/create-shelf.dto'
import { UpdateShelfDto } from './dto/update-shelf.dto'
import { ShelvesService } from './shelves.service'

//  TODO: сделать запросы на получение полок, добавление книги в полку, удаление книги из полки, создание полки, удаление полки, изменение полки

@Controller('shelves')
export class ShelvesController {
	constructor(private readonly shelvesService: ShelvesService) {}
	@Get('/get-shelves')
	@Auth()
	async getShelves(@CurrentUser('id') userId: number) {
		return this.shelvesService.getShelves(+userId)
	}

	@Get('/get-shelf/:id')
	@Auth()
	async getShelfById(@Param('id') shelfId: number) {
		return this.shelvesService.getShelfById(+shelfId)
	}

	// admin

	@Get('/create-shelf')
	@Auth('admin')
	async createShelf(dto: CreateShelfDto) {
		return this.shelvesService.createShelf(dto)
	}

	@Get('/delete-shelf/:id')
	@Auth('admin')
	async deleteShelf(@Param('id') id: string) {
		return this.shelvesService.deleteShelf(+id)
	}

	@Get('/update-shelf/:id')
	@Auth('admin')
	async updateShelf(@Param('id') id: string, dto: UpdateShelfDto) {
		return this.shelvesService.updateShelf(+id, dto)
	}
}
