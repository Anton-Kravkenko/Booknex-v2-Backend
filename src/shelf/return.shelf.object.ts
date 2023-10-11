import { Prisma } from '@prisma/client'
import { defaultReturnObject } from '../utils/return.default.object'

export const returnShelfObject: Prisma.ShelfSelect = {
	...defaultReturnObject,
	title: true,
	picture: true,
	color: true
}
