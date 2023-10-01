export const randomColor = (() => {
	const randomInt = (min: number, max: number): number => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	return () => {
		const h = randomInt(0, 360)
		const s = randomInt(42, 98)
		const l = randomInt(40, 90)
		return `hsl(${h},${s}%,${l}%)`
	}
})()

export function shadeRGBColor(color: string, percent: number): string {
	let R = Number.parseInt(color.slice(1, 3), 16)
	let G = Number.parseInt(color.slice(3, 5), 16)
	let B = Number.parseInt(color.slice(5, 7), 16)

	R = Number.parseInt(String((R * (100 + percent)) / 100))
	G = Number.parseInt(String((G * (100 + percent)) / 100))
	B = Number.parseInt(String((B * (100 + percent)) / 100))

	R = R < 255 ? R : 255
	G = G < 255 ? G : 255
	B = B < 255 ? B : 255

	R = Math.round(R)
	G = Math.round(G)
	B = Math.round(B)

	const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
	const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
	const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)

	return '#' + RR + GG + BB
}
