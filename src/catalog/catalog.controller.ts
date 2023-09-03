import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
	// TODO: Сделать рекомендации книг
	constructor(private readonly catalogService: CatalogService) {}

	@Get('/search/:query')
	async search(@Param('query') query: string) {
		return this.catalogService.search(query)
	}

	@Get('/')
	@HttpCode(200)
	async getCatalog() {
		return this.catalogService.getCatalog()
	}
}
