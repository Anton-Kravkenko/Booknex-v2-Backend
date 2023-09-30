import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

//  TODO: сделать запросы на получение полок, добавление книги в полку, удаление книги из полки, создание полки, удаление полки, изменение полки
@Injectable()
export class ShelvesService {
	constructor(private readonly prisma: PrismaService) {}
}
