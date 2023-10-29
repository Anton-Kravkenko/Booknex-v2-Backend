import type { Prisma } from '@prisma/client'
import { defaultReturnObject } from '../utils/return.default.object'

export const returnUserObject: Prisma.UserSelect = {
	...defaultReturnObject,
	email: true,
	name: true,
	password: false
}
