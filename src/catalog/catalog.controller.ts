import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { CatalogService } from './catalog.service'

@Auth()
@Controller('catalog')
export class CatalogController {
	constructor(private readonly catalogService: CatalogService) {}

	@Get('/search/:query')
	async search(@Param('query') query: string) {
		return this.catalogService.search(query)
	}

	@Get('/search-examples')
	async getSearchExamples() {
		return this.catalogService.getSearchExamples()
	}

	@Get('/')
	async getCatalog(@CurrentUser('id') userId: number) {
		return this.catalogService.getCatalog(+userId)
	}
}
