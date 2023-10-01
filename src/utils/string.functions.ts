export const simplifyString = (string: string) => {
	return string.replaceAll(/[\W_]+/g, ' ').trim()
}
