import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { GenreService } from './genre.service'

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get()
	@HttpCode(200)
	async getGenres() {
		return this.genreService.getGenres()
	}
	@Get('/:id')
	@HttpCode(200)
	async getGenreById(@Param('id') genreId: string) {
		return this.genreService.getGenreById(+genreId)
	}
}
