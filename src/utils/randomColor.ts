const randomColor = (() => {
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
