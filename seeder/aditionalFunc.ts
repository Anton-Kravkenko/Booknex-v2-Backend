import { magenta, yellow } from 'colors'
import prompts from 'prompts'
import { Page } from 'puppeteer'

export const customLinkSelect = (book: { title: string; author: string }) => {
	const typeLastLink = prompts({
		type: 'select',
		name: 'value',
		message: `epub for ${magenta(book.title)} by ${yellow(
			book.author.replace(/,.*|\(.*?\)/g, '').trim()
		)}  not found, enter your link to book:`,
		choices: [
			{
				title: '❌  None',
				value: null
			},
			{
				title: '🔧 Custom',
				value: 'custom'
			}
		]
	})
	if (typeLastLink.value === null) return null
	if (typeLastLink.value === 'custom') {
		const customResponse = prompts({
			type: 'text',
			name: 'value',
			message: `Your link:`
		})
		return customResponse.value
	}
}


export const getBookFromList = async (page: Page, link: string, numbPages: number, bookTitle: string) => {
	await page.goto(`https://www.z-epub.com${link}`, {
		waitUntil: 'domcontentloaded'
	})
	await page.waitForSelector(
		'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
	)
	const isEnglishBook = await page.evaluate(() => {
		const lang = document.querySelector('.table > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)')
		if (lang.textContent.toLowerCase().trim() === 'en' || 'english')
			return lang.textContent.toLowerCase().trim()
		return null
	})
	const bookPagesFunc = await page.evaluate((numbPages) => {
		const pages = document.querySelector('.table > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > span:nth-child(1)')
		if (Number(pages.textContent.replace('pages', '')) - numbPages > 50)
			return Number(pages.textContent.replace('pages', ''))
		return null
	}, numbPages)
	if (bookPagesFunc) {
		const response = await prompts({
			type: 'select',
			name: 'value',
			message: `A large page difference has been recorded for ${bookTitle}`,
			choices: [
				{
					title: '❌  Skip',
					value: null
				},
				{
					title: '🔧 Custom',
					value: 'custom'
				},
			]
		})
		if (response.value === null) return null
		if (response.value === 'custom') {
			const customResponse = prompts({
				type: 'text',
				name: 'value',
				message: `Your link:`
			})
			return customResponse.value
		}
	}
	if (!isEnglishBook) {
		const customResponse = await prompts({
			type: 'text',
			name: 'value',
			message: 'Book is not in English, enter your own link to epub:'
		})
		return customResponse.value
	}
	
	return  await page.evaluate(() => {
		const epub = document.querySelector(
			'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
		) ? document.querySelector(
			'div.book-links.row.justify-content-center a.col-lg-4.col-sm-4.download-link'
		) : null
		const picture = document.querySelector(
			'.book-cover > img:nth-child(1)'
		).getAttribute('src') ? document.querySelector(
			'.book-cover > img:nth-child(1)'
		).getAttribute('src') : null
		const title = document.querySelector('.col-lg-9 > h1:nth-child(1)'
		).textContent
		const author = document.querySelector(
			".table > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > a:nth-child(1)"
		).textContent
		const isbn =  document.querySelector(
			".table > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) > span:nth-child(1)"
		) ? document.querySelector(
			".table > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)"
		).textContent :  null
		
		const pages = document.querySelector('.table > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > span:nth-child(1)')
		return {
			title: title.replace(RegExp('epub', 'gi'), '')
				.replace(RegExp('free', 'gi'), '')
				.replace(RegExp('download', 'gi'), '')
				.trim(),
			author,
			picture: `https://www.z-epub.com${picture}`,
			link: `https://www.z-epub.com${epub.getAttribute('href')}`,
			isbn,
			pages: pages ? Number(pages.textContent.replace('pages', '')) : null
		}
	})
}



