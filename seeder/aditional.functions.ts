import { magenta, yellow } from 'colors'
import EPub from 'epub'
import * as fs from 'fs'

import prompts from 'prompts'

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

export const parseEpubFunc = async () => {
	const fetchs = await fetch(
		'https://psv4.userapi.com/c856416/u474117260/docs/d17/0fd831e9f7ad/IT_-_Stephen_King.epub?extra=Nhd06T7bRPdLl74z5yiqHSt5oP9zHzIZVOvO0_TtilULd_7P7IDqmgJyrMTpa7rtjs3FJCsPgDL6Ac0rZ5iXi2yy24pW42F8jambys5jniJsTOy793BlqQkw9CNoOt7IoJT9VbuZu0oMO0oPqgrDsiio&dl=1'
	)
		.then(res => res.arrayBuffer())
		.then(buffer => Buffer.from(buffer))
	const epub = new EPub(
		// @ts-ignore
		fetchs
	)
	epub.on('end', function () {
		const flow = epub.flow.map(chapter => {
			return new Promise((resolve, reject) => {
				epub.getChapter(chapter.id, (error, text) => {
					if (error) {
						reject(error)
					} else {
						resolve({
							id: chapter.id,
							title: chapter.title,
							content: `${
								chapter.title ? `<div id="${chapter.title}"></div>` : ''
							} ${text
								.replace(/ href="[^"]*"/g, '')
								.replace(/ id="[^"]*"/g, '')
								.replace(/ class="[^"]*"/g, '')
								.replace(/ xmlns="[^"]*"/g, '')
								.replace(
									/<(?!\/?(?:h[1-6]|span|div|p|i|u|abbr|address|code|q|ul|li|ol|br|strong|em|mark|a|del|sub|sup|ins|b|blockquote|cite|dfn|kbd|pre|samp|small|time|var)\b)[^>]+>/gi,
									''
								)
								.toString()}`
						})
					}
				})
			})
		})

		Promise.all(flow)
			.then(async flow => {
				const removed = await prompts({
					type: 'multiselect',
					name: 'value',
					message: 'Select chapters to remove:',
					choices: flow
						.filter((chapter: { title: string }) => chapter.title)
						.map((chapter: { id: number; title: string }) => {
							return {
								title: chapter.title,
								value: chapter.id
							}
						})
				})
				flow = flow.filter(
					(chapter: { id: number }) => !removed.value.includes(chapter.id)
				)
				const charapters = flow
					.filter((chapter: { title: string }) => chapter.title)
					.map((chapter: { title: string; id: number }) => {
						return {
							title: chapter.title,
							id: chapter.title
						}
					})
				console.log(charapters)
				const content = `<body> ${flow
					.map((chapter: { content: string }) => chapter.content)
					.join('')}</body>`
				fs.writeFile('test.html', content, function (err) {
					if (err) throw err
					console.log('Saved!')
				})
			})
			.catch(error => console.error(error))
	})
	epub.parse()
}

//if (!epubObj || !epubObj.structure) return
// 	const toc = epubObj.structure.map(structure => {
// 		return {
// 			name: structure.name,
// 			nodeId: structure.nodeId,
// 			href: structure.href,
// 			...structure
// 		}
// 	})
// 	//TODO: сделать удаление глав после чего открывать окно изменения епаба где будут местки в скорлле с елементами которые я удалил
// 	const contentBook = epubObj.sections.map(chapter => {
// 		return {
// 			id: chapter.id,
// 			content: chapter.htmlString
// 				.substring(
// 					chapter.htmlString.indexOf('<body'),
// 					chapter.htmlString.indexOf('</body>') + '</body>'.length
// 				)
// 				.replace(/ href="[^"]*"/g, '')

// 		}
// 	})
// 	console.log(contentBook.map(content => content.id))

//
// if (!removedChapters.value) return
// toc = toc.filter(structure => !removedChapters.value.includes(structure.name))

parseEpubFunc()

//
//
// const content = epubObj.sections.map(section => {
// 	return {
// 		content: section.htmlString
// 			.substring(
// 				section.htmlString.indexOf('<body'),
// 				section.htmlString.indexOf('</body>') + '</body>'.length
// 			)
// 			.replace(/ class="[^"]*"/g, '')
// 			.replace(/<body[^>]*>/, '')
// 			.replace(/<\/body>/, '')
// 			.replace(
// 				/<(?!\/?(?:h[1-6]|span|p|i|u|abbr|address|code|q|ul|li|ol|br|strong|em|mark|a|del|sub|sup|ins|b|blockquote|cite|dfn|kbd|pre|samp|small|time|var)\b)[^>]+>/gi,
// 				''
// 			)
// 	}
// })
//
