import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { GenreService } from './genre.service'

@Auth()
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get()
	async getGenres() {
		return this.genreService.getGenres()
	}

	@Get('/by-id/:id')
	async getGenreById(@Param('id') genreId: string) {
		return this.genreService.getGenreById(+genreId)
	}
}
