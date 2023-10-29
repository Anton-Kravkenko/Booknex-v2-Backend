import type { ConfigService } from '@nestjs/config'
import type { JwtModuleOptions } from '@nestjs/jwt'

export const getJwtConfig = async (
	config: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: await config.get('JWT_SECRET')
})
