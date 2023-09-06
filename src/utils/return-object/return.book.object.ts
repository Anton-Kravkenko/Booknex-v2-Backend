import { defaultReturnObject } from './return.default.object'

export const returnBookObject = {
	...defaultReturnObject,
	title: true,
	author: true,
	description: true,
	isbn: true,
	pages: true,
	image: true,
	epub: true,
	likedPercent: true,
	popularity: true
}
