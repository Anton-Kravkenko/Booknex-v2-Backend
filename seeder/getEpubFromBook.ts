import { blue, red, yellow } from 'colors'
import prompts from 'prompts'
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'

export const getEpubFromBook = async (name: string, author: string) => {
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
	await page.type(
		'.search-input',
		`${name.replace(/(\[|\()(.+?)(\]|\))/g, ' ')}`
	)
	await page.click('#header-search')
	await page.waitForSelector('.row .book-grid')
	const isError = await page.evaluate(() => {
		const error = document.querySelector('.books-list .top-filter > div > span')
		return error.innerHTML.includes('0 books')
	})
	if (isError) return console.log(red(`book ${name} is found 0 books`))
	await page.waitForSelector(
		'html body div.page div.container div.row div.col-md-12.col-sm-12.col-xs-12.books-listing div.books-list div.row.book-grid div.col-sm-12.col-md-6.col-lg-4.book-3-row'
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
			return {
				id: index++,
				title: title
					.replace('Free epub Download', '')
					.replace('Free ePub Download', '')
					.replace('epub Download', ''),
				author,
				link,
				year: year ? year.textContent.replace(',', '') : 'unknown'
			}
		})
	})
	const filterArray = bookArray
		.sort((a, b) => +b.year - +a.year)
		.find(
			book =>
				// чистое сравнение строк без пробелов, регистров
				name.toLowerCase().trim() == book.title.toLowerCase().trim() &&
				author.toLowerCase().trim() == book.author.toLowerCase().trim()
		)
	if (!filterArray) {
		const response = await prompts({
			type: 'select',
			name: 'value',
			message: `${blue(name) + ' ∙ ' + yellow(author)}`,
			choices: [
				{
					title: '⛔ None',
					value: null
				},
				...bookArray.map(book => ({
					title: `${book.id}: ${book.title} ∙ ${book.author} ∙ ${book.year}`,
					value: book
				}))
			]
		})

		// добавить парсер с royalbook
		if (!response.value) return console.log(red('book is not found'))
		await page.goto(`https://www.z-epub.com${response.value.link}`)
		await page.waitForSelector('.download-link')
		return await page.evaluate(() => {
			const epub = document.querySelector('.download-link > a')
			return epub.getAttribute('href')
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
		return epub.getAttribute('href')
	})
}

export const getEpubFromRoyalBook = async (name: string, author: string) => {
	const adblocker = AdblockerPlugin({
		blockTrackers: true // default: false
	})
	puppeteer.use(adblocker)
	const browser = await puppeteer.launch({
		headless: 'new',
		ignoreHTTPSErrors: true
	})
	const page = await browser.newPage()
	await page.goto('https://royallib.com/book/')
	await page.type('#q', `${name}`)
	await page.click('.srch-sbm')
	await page.waitForSelector('.viewbook')
	const isError = await page.evaluate(() => {
		const error = document.querySelector(
			'.content > table:nth-child(8) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'
		)
		if (error) return error.textContent === 'Не найдено'
		return null
	})
	if (isError) return console.log(red(`book ${name} is not found`))
	const bookArray = await page.evaluate(() => {
		const quotes = document.querySelectorAll(
			'.content > table:nth-child(8) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr'
		)
		return Array.from(quotes)
			.slice(1)
			.map(q => {
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
			name.toLowerCase() === book.title.toLowerCase()
	)
	if (!filterArray)
		return console.log(yellow(`book ${name} is not found on list`))
	await page.goto(`http:${filterArray.link}`)
	const isError2 = await page.evaluate(() => {
		const error = document.querySelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		if (!error) return true
	})
	if (isError2) return console.log(red(`book ${name} is not available`))
	await page.waitForSelector(
		'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
	)
	return await page.evaluate(() => {
		const epub = document.querySelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		return epub.getAttribute('href')
	})
}


const readlineTest = async () => {
		getEpubFromBook
		(
			'To Kill a Mockingbird',
			'Harper Lee'
).then(res => console.log(res))
}

readlineTest()