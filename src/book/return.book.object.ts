import type { Prisma } from '@prisma/client'
import { defaultReturnObject } from '../utils/return.default.object'

export const returnBookObject: Prisma.BookSelect = {
	...defaultReturnObject,
	title: true,
	author: {
		select: {
			name: true
		}
	},
	picture: true,
	likedPercentage: true
}
