import { blue, magenta, red, yellow } from 'colors'
import prompts from 'prompts'
import { Page } from 'puppeteer'
import { royalParser } from './royalParser'

export const getEpubFromBook = async (
	name: string,
	author: string,
	numRating: number,
	page: Page
) => {
	const betterName = name
		.replace(/(\[|\()(.+?)(\]|\))/g, ' ')
		.replace('-', ' ')
		.trim()

	await page.goto('https://www.z-epub.com/', {
		waitUntil: 'domcontentloaded'
	})
	await page.click('.search-open')
	await page.type('.search-input', betterName)
	await page.click('#header-search')
	await page.waitForSelector('.row .book-grid')
	const isError = await page.evaluate(() => {
		const error = document.querySelector('.books-list .top-filter > div > span')
		return error.innerHTML.includes('0 books')
	})
	if (isError) {
		if (numRating < 200000)
			return console.log(yellow(`❌ No result for ${betterName} by ${author}`))
		return await royalParser({ page, betterName, name, author })
	}
	await page.waitForSelector(
		'div.row div.col-md-12.col-sm-12.col-xs-12.books-listing div.books-list div.row.book-grid div.col-sm-12.col-md-6.col-lg-4.book-3-row'
	)
	const bookArray = await page.evaluate(() => {
		const quotes = document.querySelectorAll(
			'div.books-list div.row.book-grid div.col-sm-12.col-md-6.col-lg-4.book-3-row'
		)
		return Array.from(quotes).map((q, index) => {
			const title = q.querySelector(
				'div.row.book div.book-info.col-lg-9.col-9 div.book-title a'
			).textContent
			const author = q.querySelector(
				'div.row.book div.book-info.col-lg-9.col-9 div.book-attr span.book-author'
			).textContent
			const link = q
				.querySelector(
					'div.row.book div.book-info.col-lg-9.col-9 div.book-title a'
				)
				.getAttribute('href')
			const year = q.querySelector(
				'div.row.book div.book-info.col-lg-9.col-9 div.book-attr span.book-publishing-year'
			)
			const epub = new RegExp('epub', 'gi')
			const free = new RegExp('free', 'gi')
			const download = new RegExp('download', 'gi')
			return {
				id: index++,
				title: title
					.replace(epub, '')
					.replace(free, '')
					.replace(download, '')
					.split('by')[0]
					.trim(),
				author: author.trim(),
				link,
				year: year ? year.textContent.replace(',', '') : 'unknown'
			}
		})
	})
	const filterArray = bookArray
		.sort((a, b) => +b.year - +a.year)
		.find(
			book =>
				name.toLowerCase().trim() == book.title.toLowerCase() &&
				author.toLowerCase().trim() == book.author.toLowerCase().trim()
		)
	if (!filterArray) {
		const royal = await royalParser({
			page,
			betterName,
			name,
			author,
			noSelect: true
		})
		if (!royal) return
		if (typeof royal === 'string') return royal
		const epub = royal.find(
			book =>
				name.toLowerCase().trim() == book.title.toLowerCase() &&
				author
					.toLowerCase()
					.trim()
					.includes(book.author.toLowerCase().trim().split(' ')[0])
		)
		if (epub) return epub.link
		const response = await prompts({
			type: 'select',
			name: 'value',
			message: `${
				blue(betterName) +
				' ∙ ' +
				yellow(author) +
				' ∙ ' +
				magenta.bold.italic('Z-epub')
			}`,
			choices: [
				{
					title: '❌  None',
					value: null
				},
				{
					title: '🔧 Custom',
					value: 'custom'
				},
				...royal.map((book, i) => ({
					title: magenta(`👑 ${i}: ${book.title} ∙ ${book.author}`),
					value: book.link
				})),
				...bookArray.map(book => ({
					title: blue(
						`📖 ${book.id}: ${book.title} ∙ ${book.author} ∙ ${book.year}`
					),
					value: book
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
		if (!response.value) return
		if (typeof response.value === 'string') {
			await page.goto(`http:${response.value}`)
			const isError2 = await page.evaluate(() => {
				const error = document.querySelector(
					'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
				)
				if (!error) return true
			})
			if (isError2) return console.log(red(`❌ book ${name} is not available `))
			await page.waitForSelector(
				'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
			)
			return await page.evaluate(() => {
				const epub = document.querySelector(
					'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
				)
				return `http:${epub.getAttribute('href')}`
			})
		}
		await page.goto(`https://www.z-epub.com${response.value.link}`, {
			waitUntil: 'domcontentloaded'
		})
		await page.waitForSelector(
			'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
		)
		return await page.evaluate(() => {
			const epub = document.querySelector(
				'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
			)
			return `https://www.z-epub.com${epub.getAttribute('href')}`
		})
	}
	await page.goto(`https://www.z-epub.com${filterArray.link}`, {
		waitUntil: 'domcontentloaded'
	})
	await page.waitForSelector(
		'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
	)
	return await page.evaluate(() => {
		const epub = document.querySelector(
			'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
		)
		return `https://www.z-epub.com${epub.getAttribute('href')}`
	})
}
