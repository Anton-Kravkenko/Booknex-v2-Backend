import { S3Client } from '@aws-sdk/client-s3'
import process from 'node:process'
import puppeteer from 'puppeteer'
import { uploadBook } from './upload-book'

export const GoodreadsParser = async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions']
	})
	const page = await browser.newPage()
	await page.setRequestInterception(true)
	const s3 = new S3Client({
		endpoint: process.env.AWS_ENDPOINT,
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})
	page.on('request', request => {
		if (
			request.resourceType() === 'media' ||
			request.resourceType() === 'font' ||
			request.resourceType() === 'manifest' ||
			[
				'https://pagead2.googlesyndication.com',
				'https://creativecdn.com',
				'https://www.googletagmanager.com',
				'https://cdn.krxd.net',
				'https://adservice.google.com',
				'https://cdn.concert.io',
				'https://z.moatads.com',
				'https://cdn.permutive.com'
			].some(d => request.url().startsWith(d))
		) {
			request.abort()
		} else {
			request.continue()
		}
	})
	const totalPage = 40
	for (let index = 2; index < totalPage; index++) {
		await page.goto(
			'https://www.goodreads.com/list/show/1.Best_Books_Ever?page=' + index
		)
		await page.waitForSelector('.tableList')
		const books = await page.evaluate(() => {
			const books = document.querySelectorAll('.tableList tr')
			return [...books].map((book, index) => {
				const link = book.querySelector('.bookTitle').getAttribute('href')
				const ratingAvg = book.querySelector('.minirating')
				return {
					id: index++,
					link: `https://www.goodreads.com${link}`,
					ratingAvg: ratingAvg.textContent
						? Number.parseFloat(
								ratingAvg.textContent.split('—')[0].replaceAll('avg rating', '')
						  )
						: 2.5
				}
			})
		})
		for (let BooksIndex = 0; BooksIndex < books.length; BooksIndex++) {
			try {
				const book = books[BooksIndex]
				await page.goto(book.link)
				await page.waitForSelector('div.BookPageTitleSection > div > h1')
				await page.waitForSelector(
					'div.FeaturedPerson__infoPrimary > h4 > a > span'
				)
				await page.waitForSelector(
					'div.FeaturedPerson__profile > div.FeaturedPerson__avatar > a > img'
				)
				await page.waitForSelector(
					'div.BookPageMetadataSection > div.PageSection > div.TruncatedContent > div.TruncatedContent__text.TruncatedContent__text--medium > div > div > span'
				)
				await page.waitForSelector(
					'div.BookPageMetadataSection > div.BookPageMetadataSection__description > div > div.TruncatedContent__text.TruncatedContent__text--large > div > div > span'
				)

				await page.waitForSelector('[data-testid="ratingsCount"]')
				await page.waitForSelector('[data-testid="pagesFormat"]')

				await page.waitForSelector(
					'div.BookPage__bookCover > div > div > div > div > div > div > img'
				)

				await page.waitForSelector(
					'div.BookPageMetadataSection > div.BookPageMetadataSection__genres > ul > span:nth-child(1) > span > a > .Button__labelItem'
				)

				console.log(`📖 ${BooksIndex + 1}/${books.length}`)
				const title = await page.evaluate(() => {
					const title = document.querySelector(
						'div.BookPageTitleSection > div > h1'
					)
					return title.textContent ? title.textContent : 'No title'
				})
				const author = await page.evaluate(() => {
					const author = document.querySelector(
						'div.FeaturedPerson__infoPrimary > h4 > a > span'
					)
					const authorPicture = document.querySelector(
						'div.FeaturedPerson__profile > div.FeaturedPerson__avatar > a > img'
					)
					const authorDescription = document.querySelector(
						'div.BookPageMetadataSection > div.PageSection > div.TruncatedContent > div.TruncatedContent__text.TruncatedContent__text--medium > div > div > span'
					)
					return {
						name: author.textContent ? author.textContent : 'No author name',
						picture: authorPicture.getAttribute('src') ?? 'No author picture',
						description: authorDescription.textContent
							? authorDescription.textContent.replaceAll(
									/(Librarian's note|Contributor note|See also).*?\./g,
									''
							  )
							: 'No author description'
					}
				})

				const description = await page.evaluate(() => {
					const description = document.querySelector(
						'div.BookPageMetadataSection > div.BookPageMetadataSection__description > div > div.TruncatedContent__text.TruncatedContent__text--large > div > div > span'
					)
					return description.textContent
						? description.textContent.replaceAll(
								/(Librarian's note|Contributor note|See also).*?\./g,
								''
						  )
						: 'No description'
				})
				const rating = await page.evaluate(() => {
					const selector = '[data-testid="ratingsCount"]'
					const ratingCount = document.querySelector(selector)
					return ratingCount.textContent
						? Number.parseInt(
								ratingCount.textContent
									.replaceAll('ratings', '')
									.replaceAll(',', '')
									.trim()
						  )
						: 0
				})
				const pages = await page.evaluate(() => {
					const selector = '[data-testid="pagesFormat"]'
					const pages = document.querySelector(selector)
					return pages.textContent
						? Number.parseInt(
								pages.textContent.replaceAll(/[^\d\s,]/g, '').trim()
						  )
						: 0
				})
				const picture = await page.evaluate(() => {
					const picture = document.querySelector(
						'div.BookPage__bookCover > div > div > div > div > div > div > img'
					)
					return picture.getAttribute('src')
						? picture.getAttribute('src')
						: 'No picture'
				})

				const genres = await page.evaluate(() => {
					const genres = document.querySelectorAll(
						'div.BookPageMetadataSection > div.BookPageMetadataSection__genres > ul > span:nth-child(1) > span > a > .Button__labelItem'
					)
					return [...genres].map(genre => genre.textContent)
						? [...genres].map(genre => genre.textContent)
						: ['No genres']
				})

				if (rating < 40_000) {
					console.log(`❌ No result for ${title} by ${author.name}`)
					return
				}
				await uploadBook({
					s3,
					title,
					author: {
						name: author.name.replaceAll(/,.*|\(.*?\)/g, '').trim(),
						picture: author.picture,
						description: author.description
					},
					description,
					pages: pages,
					genres: genres,
					numRatings: rating,
					coverImg: picture,
					likedPercent: Number.parseFloat((book.ratingAvg * 20).toFixed(1)),
					page
				})
			} catch {
				console.log(`❌ Error for ${BooksIndex + 1}/${books.length}`)
			}
		}
	}
	await browser.close()
}

GoodreadsParser().then(value => {
	process.exit(0)
})
