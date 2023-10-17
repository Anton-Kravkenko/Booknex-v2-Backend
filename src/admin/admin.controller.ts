import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { GetFindResult } from '@prisma/client/runtime/library'
import { Auth } from '../decorator/auth.decorator'
import { AdminService } from './admin.service'

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}
	@Auth('admin')
	@Get('/statistics')
	async statistics(): Promise<{
		totalUsers: number
		totalReadTime: number
		mostReadBook: GetFindResult<
			Prisma.$BookPayload,
			{
				take: number
				select: Prisma.BookSelect
				orderBy: { histories: { _count: string } }
			}
		>[]
	}> {
		return this.adminService.statistics()
	}
}
