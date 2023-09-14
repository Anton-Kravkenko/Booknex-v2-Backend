import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
	constructor(private readonly catalogService: CatalogService) {}

	@Get('/search/:query')
	async search(@Param('query') query: string) {
		return this.catalogService.search(query)
	}

	@Get('/')
	@Auth()
	async getCatalog(@CurrentUser('id') userId: number) {
		return this.catalogService.getCatalog(+userId)
	}
}
