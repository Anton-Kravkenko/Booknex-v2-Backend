import { defaultReturnObject } from './return.default.object'

export const returnUserObject = {
	...defaultReturnObject,
	email: true,
	name: true,
	password: false
}
