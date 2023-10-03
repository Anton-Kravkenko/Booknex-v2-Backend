import { defaultReturnObject } from '../utils/return.default.object'

export const returnUserObject = {
	...defaultReturnObject,
	email: true,
	name: true,
	password: false
}
