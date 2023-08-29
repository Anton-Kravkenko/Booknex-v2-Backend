import { Controller } from '@nestjs/common'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
	// TODO: Сделать рекомендации книг
	// Сделать всё запросы что в todo листе
	// Сделать всё предметы у барона которые ты можешь купить
	constructor(private readonly catalogService: CatalogService) {}
}
