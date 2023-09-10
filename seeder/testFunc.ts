export const testFunc = async () => {
	const randomElement = ["Lily", "Boo", 'Boots', 'Lucky', "Harley",
		"Bear", "Chester", "Luna", "Bob", "Maggie"
	]
	
	const randomIndex = Math.floor(Math.random() * randomElement.length)
	const randomName = randomElement[randomIndex]
	
	return `https://api.dicebear.com/7.x/notionists-neutral/png?seed=${randomName}&backgroundColor=transparent`
}

testFunc().then((value) => {
  console.log(value)
})

