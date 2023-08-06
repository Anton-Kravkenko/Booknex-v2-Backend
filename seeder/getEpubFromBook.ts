import { blue, magenta, yellow } from 'colors'
import prompts from 'prompts'
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import { royalParser } from './royalParser'

export const getEpubFromBook = async (
	name: string,
	author: string,
	numRating: number
) => {
	const betterName = name
		.replace(/(\[|\()(.+?)(\]|\))/g, ' ')
		.replace('-', ' ')
		.trim()
	const adblocker = AdblockerPlugin({
		blockTrackers: true
	})
	puppeteer.use(adblocker)
	const browser = await puppeteer.launch({
		headless: 'new',
		ignoreHTTPSErrors: true
	})
	const page = await browser.newPage()
	await page.goto('https://www.z-epub.com/')
	await page.click('.search-open')
	await page.type('.search-input', betterName)
	await page.click('#header-search')
	await page.waitForSelector('.row .book-grid')
	const isError = await page.evaluate(() => {
		const error = document.querySelector('.books-list .top-filter > div > span')
		return error.innerHTML.includes('0 books')
	})
	if (isError) {
		if (numRating < 100000)
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
				...bookArray.map(book => ({
					title: `📖 ${book.id}: ${book.title} ∙ ${book.author} ∙ ${book.year}`,
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
		if (response.value === 'royal')
			return await royalParser({ page, betterName, name, author })
		if (!response.value) return
		await page.goto(`https://www.z-epub.com${response.value.link}`)
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
	await page.goto(`https://www.z-epub.com${filterArray.link}`)
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
