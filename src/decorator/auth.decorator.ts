import { applyDecorators, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../guard/admin.guard'
import { JwtGuard } from '../guard/jwt.guard'

export const Auth = (role: 'admin' | 'user' = 'user') =>
	applyDecorators(
		role === 'admin' ? UseGuards(JwtGuard, AdminGuard) : UseGuards(JwtGuard)
	)
