export const simplifyString = (string: string) =>
	string
		.replaceAll(/[\W_]+/g, ' ')
		.trim()
		.toLowerCase() // convert to lowercase
		.replaceAll(/[^\d a-z-]/g, '') // remove non-alphanumeric characters
		.replaceAll(/\s+/g, '-') // replace spaces with hyphens
		.replaceAll(/-+/g, '-')
