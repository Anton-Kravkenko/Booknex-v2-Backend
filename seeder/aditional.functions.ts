import { bgGreen, magenta, yellow } from 'colors'
import prompts from 'prompts'
import type { Page } from 'puppeteer'

export const customLinkSelect = async (book: {
	title: string
	author: string
}) => {
	const typeLastLink = await prompts({
		type: 'select',
		name: 'value',
		message: `epub for ${magenta(book.title)} by ${yellow(
			book.author
		)}  not found, enter your link to book:`,
		choices: [
			{
				title: '❌  None',
				value: undefined
			},
			{
				title: '🔧 Custom',
				value: 'custom'
			}
		]
	})
	if (typeLastLink.value === undefined) return
	if (typeLastLink.value === 'custom') {
		const customResponse = await prompts({
			type: 'text',
			name: 'value',
			message: 'Your link:'
		})
		return customResponse.value
	}
}

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
