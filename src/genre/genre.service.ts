import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	getGenres() {
		return this.prisma.genre.findMany()
	}

	async getGenreById(id: number) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				id: +id
			}
		})

		if (!genre) throw new BadRequestException('Genre not found')

		return genre
	}
}
