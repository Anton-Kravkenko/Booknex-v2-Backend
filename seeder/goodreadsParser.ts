import puppeteer from 'puppeteer'

export const GoodreadsParser = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--autoplay-policy=user-gesture-required',
			'--disable-background-networking',
			'--disable-background-timer-throttling',
			'--disable-backgrounding-occluded-windows',
			'--disable-breakpad',
			'--disable-client-side-phishing-detection',
			'--disable-component-update',
			'--disable-default-apps',
			'--disable-dev-shm-usage',
			'--disable-domain-reliability',
			'--disable-extensions',
			'--disable-features=AudioServiceOutOfProcess',
			'--disable-hang-monitor',
			'--disable-ipc-flooding-protection',
			'--disable-notifications',
			'--disable-offer-store-unmasked-wallet-cards',
			'--disable-popup-blocking',
			'--disable-print-preview',
			'--disable-prompt-on-repost',
			'--disable-renderer-backgrounding',
			'--disable-setuid-sandbox',
			'--disable-speech-api',
			'--disable-sync',
			'--hide-scrollbars',
			'--ignore-gpu-blacklist',
			'--metrics-recording-only',
			'--mute-audio',
			'--no-default-browser-check',
			'--no-first-run',
			'--no-pings',
			'--no-sandbox',
			'--no-zygote',
			'--password-store=basic',
			'--use-gl=swiftshader',
			'--use-mock-keychain',
			'--headless',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-sandbox',
			'--disable-canvas-aa',
			'--disable-2d-canvas-clip-aa',
			'--disable-dev-shm-usage',
			'--no-zygote',
			'--use-gl=swiftshader',
			'--enable-webgl',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-first-run',
			'--disable-infobars',
			'--disable-breakpad',
			'--window-size=1280,1024',
			'--user-data-dir=./chromeData',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions']
	})
	const page = await browser.newPage()
	await page.setRequestInterception(true)
	const blockedDomains = [
		'https://pagead2.googlesyndication.com',
		'https://creativecdn.com',
		'https://www.googletagmanager.com',
		'https://cdn.krxd.net',
		'https://adservice.google.com',
		'https://cdn.concert.io',
		'https://z.moatads.com',
		'https://cdn.permutive.com'
	]

	page.on('request', request => {
		if (
			request.resourceType() === 'image' ||
			blockedDomains.some(d => request.url().startsWith(d))
		) {
			request.abort()
		} else {
			request.continue()
		}
	})
	const FinalBooks = []
	const totalPage = 40
	for (let index = 1; index < totalPage; index++) {
		page.goto(
			'https://www.goodreads.com/list/show/1.Best_Books_Ever?page=' + index
		)
		await page.waitForSelector('.tableList')
		const books = await page.evaluate(() => {
			const books = document.querySelectorAll('.tableList tr')
			return [...books].map((book, index) => {
				const link = book.querySelector('.bookTitle').getAttribute('href')
				return {
					id: index++,
					link: `https://www.goodreads.com${link}`
				}
			})
		})
		for (let BooksIndex = 0; BooksIndex < books.length; BooksIndex++) {
			try {
				const book = books[BooksIndex]
				page.goto(book.link)
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
									/(Librarian Note|Contributor Note).*?\./g,
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
								/(Librarian Note|Contributor Note).*?\./g,
								''
						  )
						: 'No description'
				})
				const rating = await page.evaluate(() => {
					const selector = '[data-testid="ratingsCount"]'
					const ratingCount = document.querySelector(selector)
					return ratingCount.textContent
						? ratingCount.textContent
								.replaceAll('ratings', '')
								.replaceAll(',', '')
								.trim()
						: 'No rating'
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
						: 'No genres'
				})
				if (Number(rating) < 40_000) continue
				FinalBooks.push({
					title,
					author,
					description,
					rating: Number(rating),
					picture,
					genres
				})
			} catch {}
		}
	}
	console.log(FinalBooks)
	await browser.close()
	return FinalBooks
}

GoodreadsParser().then(value => {
	console.log(value)
	process.exit(0)
})
