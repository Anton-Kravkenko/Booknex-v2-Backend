import { bgGreen, blue, magenta, yellow } from 'colors'
import prompts from 'prompts'
import type { Page } from 'puppeteer'
import { customLinkSelect } from './aditional.functions'

export const getBookFromList = async (
	page: Page,
	link: string,
	numbPages: number,
	bookTitle: string
) => {
	await page.goto(
		link.startsWith('http') ? link : `https://www.z-epub.com${link}`,
		{
			waitUntil: 'domcontentloaded'
		}
	)
	await page.waitForSelector(
		'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
	)
	await page.waitForSelector('[itemprop="numberOfPages"]')
	const isEnglishBook = await page.evaluate(() => {
		const lang = document.querySelector(
			'body > section > div > div > div.col-lg-9 > table > tbody > tr:nth-child(9) > td:nth-child(2)'
		)
		if (lang.textContent.toLowerCase().trim() === 'en' || 'english') {
			return lang.textContent.toLowerCase().trim()
		}
		return false
	})
	if (!isEnglishBook) {
		return customLinkSelect({
			title: bookTitle,
			author: ''
		})
	}
	const bookPagesFunction = await page.evaluate(() => {
		const pages = document.querySelector('[itemprop="numberOfPages"]')
		return Number.parseInt(pages.textContent.replace('pages', ''))
	})

	if (numbPages - bookPagesFunction > 60) {
		const response = await prompts({
			type: 'select',
			name: 'value',
			message: `A large page difference has been recorded for ${bookTitle} | ${bookPagesFunction} -currentEpub of ${numbPages} -goodreads:`,
			choices: [
				{
					title: '❌  Skip',
					value: undefined
				},
				{
					title: '🔧 Custom',
					value: 'custom'
				}
			]
		})
		if (response.value === 'custom') {
			const customResponse = await prompts({
				type: 'text',
				name: 'value',
				message: `Your link to ${bgGreen('Z-epub')}:`
			})
			return getBookFromList(page, customResponse.value, numbPages, bookTitle)
		}
	}
	return page.evaluate(bookPagesFunction => {
		const epub = document
			.querySelector(
				'div.book-links.row.justify-content-center > a.col-lg-4.col-sm-4.download-link'
			)
			.getAttribute('href')

		const picture = document
			.querySelector('div.book-cover > img')
			.getAttribute('src')

		const title = document.querySelector(
			'.col-lg-9 > h1:nth-child(1)'
		).textContent
		return {
			title: title
				.replaceAll(new RegExp('epub', 'gi'), '')
				.replaceAll(new RegExp('free', 'gi'), '')
				.replaceAll(new RegExp('download', 'gi'), '')
				.trim(),
			picture: `https://www.z-epub.com${picture}`,
			link: `https://www.z-epub.com${epub}`,
			pages: bookPagesFunction
		}
	}, bookPagesFunction)
}
export const ZEpubParser = async (
	name: string,
	author: string,
	bookPages: number,
	numberRating: number,
	page: Page
) => {
	const betterName = name
		.replaceAll(/([([])(.+?)(\)])/g, ' ')
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
		if (numberRating < 100_000) {
			console.log(yellow(`❌ No result for ${betterName} by ${author}`))
			return
		}
		return customLinkSelect({
			title: betterName,
			author: author
		})
	}
	await page.waitForSelector(
		'div.row div.col-md-12.col-sm-12.col-xs-12.books-listing div.books-list div.row.book-grid div.col-sm-12.col-md-6.col-lg-4.book-3-row'
	)
	const bookArray = await page.evaluate(() => {
		const quotes = document.querySelectorAll(
			'div.books-list div.row.book-grid div.col-sm-12.col-md-6.col-lg-4.book-3-row'
		)
		return [...quotes].map((q, index) => {
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
					.replaceAll(new RegExp('epub', 'gi'), '')
					.replaceAll(new RegExp('free', 'gi'), '')
					.replaceAll(new RegExp('download', 'gi'), '')
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
					value: undefined
				},
				{
					title: '🔧 Custom',
					value: 'custom'
				},
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
		return getBookFromList(page, response.value.link, bookPages, betterName)
	}
	return getBookFromList(page, filterArray.link, bookPages, betterName)
}
