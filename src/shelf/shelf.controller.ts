import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CreateShelfDto } from './dto/create.shelf.dto'
import { UpdateShelfDto } from './dto/update.shelf.dto'
import { ShelfService } from './shelf.service'

@Controller('shelf')
export class ShelfController {
	constructor(private readonly shelvesService: ShelfService) {}

	@Get('/by-id/:id')
	@Auth()
	async getShelfById(@Param('id') shelfId: number) {
		return this.shelvesService.getShelfById(+shelfId)
	}

	// admin
	@Get('/all')
	@Auth('admin')
	async getAllShelves() {
		return this.shelvesService.getAllShelves()
	}

	@Post('/create')
	@Auth('admin')
	async createShelf(@Body() dto: CreateShelfDto) {
		return this.shelvesService.createShelf(dto)
	}

	@Delete('/delete/:id')
	@Auth('admin')
	async deleteShelf(@Param('id') id: string) {
		return this.shelvesService.deleteShelf(+id)
	}

	@Put('/update/:id')
	@Auth('admin')
	async updateShelf(@Param('id') id: string, @Body() dto: UpdateShelfDto) {
		return this.shelvesService.updateShelf(+id, dto)
	}
}
