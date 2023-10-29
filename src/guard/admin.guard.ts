import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { ForbiddenException, Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>()
		const user = request.user
		if (!user.isAdmin)
			throw new ForbiddenException('You are not an admin').getResponse()
		return true
	}
}
