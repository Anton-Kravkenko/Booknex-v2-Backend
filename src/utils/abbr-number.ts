/* eslint-disable no-param-reassign */
export function abbrNumber(number: number, decPlaces: number): string {
	const abbrev: string[] = ['k', 'm', 'b', 't']
	for (let index: number = abbrev.length - 1; index >= 0; index--) {
		const size: number = Math.pow(10, (index + 1) * 3)
		if (size <= number) {
			number = Math.round((number * decPlaces) / size) / decPlaces

			if (number === 1000 && index < abbrev.length - 1) {
				number = 1
				index++
			}
			return number + abbrev[index]
		}
	}
	return number.toString()
}
