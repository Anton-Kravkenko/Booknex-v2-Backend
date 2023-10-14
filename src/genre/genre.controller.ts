import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { GenreService } from './genre.service'

@Auth()
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get()
	async all() {
		return this.genreService.all()
	}

	@Get('/by-id/:id')
	async byId(@Param('id') genreId: string) {
		return this.genreService.byId(+genreId)
	}
}
