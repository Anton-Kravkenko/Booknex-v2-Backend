import type { Prisma } from '@prisma/client'
import { defaultReturnObject } from '../utils/return.default.object'

export const returnReviewsObject: Prisma.ReviewSelect = {
	...defaultReturnObject,
	text: true,
	emotion: true,
	tags: true
}
