import { Prisma } from '@prisma/client'
import { defaultReturnObject } from '../utils/return.default.object'

export const returnAuthorObject: Prisma.AuthorSelect = {
	...defaultReturnObject,
	name: true
}
