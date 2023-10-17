import { Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from '../decorator/auth.decorator'
import { CurrentUser } from '../decorator/user.decorator'
import { CatalogService } from './catalog.service'

@Auth()
@ApiTags('catalog')
@ApiBearerAuth()
@Controller('catalog')
export class CatalogController {
	constructor(private readonly catalogService: CatalogService) {}

	@Get('/search/:query')
	async search(@Param('query') query: string) {
		return this.catalogService.search(query)
	}

	@Get('/search-examples')
	async searchExamples() {
		return this.catalogService.searchExamples()
	}

	@Get('/')
	async catalog(@CurrentUser('id') userId: number) {
		return this.catalogService.catalog(+userId)
	}
}
