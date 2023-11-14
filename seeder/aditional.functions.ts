import { parseEpub } from '@gxl/epub-parser'
import { bgGreen, magenta, yellow } from 'colors'
import * as fs from 'fs'
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
//TODO: дофиксить и дооптимизировать парсер
export const parseEpubFunc = async () => {
	const file = await fetch(
		'https://psv4.userapi.com/c909418/u786618039/docs/d45/913a9c3a8b01/Harry_Potter_and_the_Philosopher_39_s_Stone.epub?extra=q1rVhz3xDucqGuv-GliHwfMKmsfVIC048itTyGJfjtfnkOadOKcV9ck9_PqJyLcFLFpuyU1gdx2KMhjh95vX7YqsvZtPu__dXGwSL7iXsoeCs2fF57CDJf_p_xwDKcLjHVVzK7HtepnPKGvmR4AYJkhP&dl=1'
	).then(res => res.arrayBuffer())

	const epubObj = await parseEpub(Buffer.from(file))
	console.log(epubObj.structure)
	const removedChapters = await prompts({
		type: 'multiselect',
		name: 'value',
		message: 'Select chapters to remove:',
		choices: epubObj.structure.map(chapter => {
			return {
				title: chapter.name,
				value: chapter.name
			}
		})
	})

	if (!removedChapters.value) return
	const toc = epubObj.structure
		.filter(structure => !removedChapters.value.includes(structure.name))
		.map(structure => {
			return {
				title: structure.name,
				link: `${structure.nodeId}`
			}
		})

	console.log(toc)

	const content = epubObj.sections.map(section => {
		return {
			content: section.htmlString
				.substring(
					section.htmlString.indexOf('<body'),
					section.htmlString.indexOf('</body>') + '</body>'.length
				)
				.replace(/ class="[^"]*"/g, '')
				.replace(/<body[^>]*>/, '')
				.replace(/<\/body>/, '')
				.replace(/href="[^"]*"/g, '')
				.replace(
					/<(?!\/?(?:h[1-6]|span|p|i|u|abbr|address|code|q|ul|li|ol|br|strong|em|mark|a|del|sub|sup|ins|b|blockquote|cite|dfn|kbd|pre|samp|small|time|var)\b)[^>]+>/gi,
					''
				)
		}
	})
	const regexPattern = new RegExp(`<p><a id="${toc[0].link}"><\\/a>(.*?)<\\/p>`)

	const structure = epubObj.structure.map(chapter => {
		return {
			title: chapter.name,
			link: `${chapter.nodeId}`
		}
	})
	const lastTOc = toc.at(-1).link
	const lastContent =
		structure.findIndex(chapter => chapter.link === lastTOc) + 1
	const lastLink = structure[lastContent].link
	const lastRegexPattern = new RegExp(
		`<p><a id="${lastLink}"><\\/a>(.*?)<\\/p>`
	)
	const concatenatedTags =
		`<p><a id="${toc[0].link}"></a></p>` +
		content
			.map(value => value.content)
			.join('')
			.split(regexPattern)
			.pop()
			.trim()
			.toString()
			.split(lastRegexPattern, 1)
			.pop()
			.trim()
			.toString()
			.replace(/id="[^"]*"/g, match => {
				const id = match.split('"')[1]
				const tocItem = toc.find(item => item.link === id)
				if (!tocItem) return ''
				return match
			})
	fs.writeFile('output.html', concatenatedTags, err => {
		if (err) {
			console.error(err)
			return
		}
	})
}

parseEpubFunc()
