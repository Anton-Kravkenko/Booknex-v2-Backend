import { Controller, Get } from '@nestjs/common'
import { Auth } from '../decorator/auth.decorator'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Auth('admin')
	@Get('/statistics')
	async getStatistics() {
		return this.adminService.getStatistics()
	}
}
