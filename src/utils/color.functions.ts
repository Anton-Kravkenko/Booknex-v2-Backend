export function randomColor() {
	const h =
		Math.random() < 0.5
			? Math.floor(Math.random() * 60)
			: 90 + Math.floor(Math.random() * 270)
	const s = 70 + Math.random() * 30
	let l = 35 + Math.random() * 30
	l /= 100
	const a = (s * Math.min(l, 1 - l)) / 100
	const f = n => {
		const k = (n + h / 30) % 12
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0')
	}
	return `#${f(0)}${f(8)}${f(4)}`
}

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
