import { blue, magenta, red, yellow } from 'colors'
import prompts from 'prompts'
import { Page } from 'puppeteer'

export const royalParser = async ({
	page,
	betterName,
	name,
	author,
	noSelect = false
}: {
	page: Page
	betterName: string
	name: string
	author: string
	noSelect?: boolean
}) => {
	await page.goto('https://royallib.com/book/', {
		waitUntil: 'domcontentloaded'
	})
	await page.type('#q', `${name}`)
	await page.click('.srch-sbm')
	await page.waitForSelector('.viewbook')
	const isError = await page.evaluate(() => {
		const error = document.querySelector(
			'.content > table:nth-child(8) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
		)
		if (error) return error.textContent === 'Не найдено'
		return false
	})
	if (isError) {
		console.log(red(`❌ books ${name} is not found`))
		return
	}
	const bookArray = await page.evaluate(() => {
		const quotes = document.querySelectorAll(
			'.content > table:nth-child(8) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr'
		)
		return [...quotes].slice(1).map(q => {
			const title = q.querySelector('td:nth-child(1) > a').textContent
			const author = q.querySelector('td:nth-child(3) > a > font').textContent
			const link = q.querySelector('td:nth-child(1) > a').getAttribute('href')
			return {
				title,
				link,
				author
			}
		})
	})
	const filterArray = bookArray.find(
		book =>
			book.title.toLowerCase().trim() === betterName.toLowerCase().trim() &&
			author
				.toLowerCase()
				.trim()
				.includes(book.author.toLowerCase().trim().split(' ')[0])
	)
	if (filterArray && noSelect) {
		if (
			bookArray.filter(
				book =>
					book.title
						.toLowerCase()
						.trim()
						.includes(betterName.toLowerCase().trim()) ||
					betterName
						.toLowerCase()
						.trim()
						.includes(book.title.toLowerCase().trim())
			).length === 0
		)
			return false
		return bookArray.filter(
			book =>
				book.title
					.toLowerCase()
					.trim()
					.includes(betterName.toLowerCase().trim()) ||
				betterName
					.toLowerCase()
					.trim()
					.includes(book.title.toLowerCase().trim())
		)
	}
	if (!filterArray && !noSelect) {
		if (
			bookArray.filter(
				book =>
					book.title
						.toLowerCase()
						.trim()
						.includes(betterName.toLowerCase().trim()) ||
					betterName
						.toLowerCase()
						.trim()
						.includes(book.title.toLowerCase().trim())
			).length === 0
		) {
			console.log(red(`❌ book ${name} is not found`))
			return
		}
		const response = await prompts({
			type: 'select',
			name: 'value',
			message: `${
				blue(betterName) +
				' ∙ ' +
				yellow(author) +
				' ∙ ' +
				magenta.bold.italic('Royallib')
			}`,
			choices: [
				{
					title: `❌ None`,
					value: false
				},
				{
					title: '🔍 Write your own link',
					value: 'custom'
				},
				...bookArray
					.filter(
						book =>
							book.title
								.toLowerCase()
								.trim()
								.includes(betterName.toLowerCase().trim()) ||
							betterName
								.toLowerCase()
								.trim()
								.includes(book.title.toLowerCase().trim())
					)
					.map((book, index) => ({
						title: `📖 ${index++}: ${book.title} ∙ ${book.author}`,
						value: book.link
					}))
			]
		})
		if (response.value === 'custom') {
			const customResponse = await prompts({
				type: 'text',
				name: 'value',
				message: 'Enter your own link to epub:'
			})

			return customResponse.value
		}
		if (response.value === false) return
		await page.goto(`http:${response.value}`, { waitUntil: 'domcontentloaded' })
		const isError3 = await page.evaluate(() => {
			const error = document.querySelector(
				'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
			)
			if (!error) return true
		})
		if (isError3) {
			console.log(red(`❌ book ${name} is not available`))
			return
		}
		await page.waitForSelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		return page.evaluate(() => {
			const epub = document.querySelector(
				'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
			)
			return `http:${epub.getAttribute('href')}`
		})
	}
	await page.goto(`http:${filterArray.link}`, { waitUntil: 'domcontentloaded' })
	const isError2 = await page.evaluate(() => {
		const error = document.querySelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		if (!error) return true
	})
	if (isError2) {
		console.log(red(`❌ book ${name} is not available `))
		return
	}
	await page.waitForSelector(
		'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
	)
	return page.evaluate(() => {
		const epub = document.querySelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		return `http:${epub.getAttribute('href')}`
	})
}
