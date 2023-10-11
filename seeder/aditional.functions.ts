import { bgGreen, magenta, yellow } from 'colors'
import prompts from 'prompts'
import { Page } from 'puppeteer'

export const customLinkSelect = async (book: {
	title: string
	author: string
}) => {
	const typeLastLink = await prompts({
		type: 'select',
		name: 'value',
		message: `epub for ${magenta(book.title)} by ${yellow(
			book.author.replaceAll(/,.*|\(.*?\)/g, '').trim()
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
			message: `Your link:`
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
	// await page.waitForSelector(
	// 	'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
	// )
	const isEnglishBook = await page.evaluate(() => {
		const lang = document.querySelector(
			'.table > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)'
		)
		if (lang.textContent.toLowerCase().trim() === 'en' || 'english')
			return lang.textContent.toLowerCase().trim()
	})
	const bookPagesFunction = await page.evaluate(numbPages => {
		const pages = document.querySelector(
			'.table > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > span:nth-child(1)'
		)
		if (Number(pages.textContent.replace('pages', '')) < numbPages)
			return Number(pages.textContent.replace('pages', ''))
	}, numbPages)
	if (bookPagesFunction) {
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
	if (!isEnglishBook) {
		const customResponse = await prompts({
			type: 'text',
			name: 'value',
			message: `Book is not in English, enter your own link to ${bgGreen(
				'Z-epub'
			)}:`
		})
		return getBookFromList(page, customResponse.value, numbPages, bookTitle)
	}

	return page.evaluate(() => {
		const epub = document.querySelector(
			'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
		)
			? document.querySelector(
					'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
			  )
			: undefined
		const picture = document
			.querySelector('.book-cover > img:nth-child(1)')
			.getAttribute('src')
			? document
					.querySelector('.book-cover > img:nth-child(1)')
					.getAttribute('src')
			: undefined
		const title = document.querySelector(
			'.col-lg-9 > h1:nth-child(1)'
		).textContent
		const author = document.querySelector(
			'.table > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > a:nth-child(1)'
		).textContent
		const isbn = document.querySelector(
			'.table > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) > span:nth-child(1)'
		)
			? document.querySelector(
					'.table > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)'
			  ).textContent
			: undefined

		const pages = document.querySelector(
			'.table > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > span:nth-child(1)'
		)
		return {
			title: title
				.replaceAll(new RegExp('epub', 'gi'), '')
				.replaceAll(new RegExp('free', 'gi'), '')
				.replaceAll(new RegExp('download', 'gi'), '')
				.trim(),
			author,
			picture: `https://www.z-epub.com${picture}`,
			link: `https://www.z-epub.com${epub.getAttribute('href')}`,
			isbn,
			pages: pages ? Number(pages.textContent.replace('pages', '')) : undefined
		}
	})
}
