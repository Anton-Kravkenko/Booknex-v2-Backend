import { red, yellow } from 'colors'
import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'

export const getEpubFromBook = async (name: string, author: string) => {
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
			author.toLowerCase().includes(book.author.toLowerCase().split(' ')[0]) &&
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
	const epubLink = await page.evaluate(() => {
		const epub = document.querySelector(
			'.content > table:nth-child(16) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(18)'
		)
		return epub.getAttribute('href')
	})
	return epubLink
}
