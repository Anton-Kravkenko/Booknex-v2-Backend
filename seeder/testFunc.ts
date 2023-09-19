import puppeteer from 'puppeteer-extra'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import { getEpubFromBook } from './getEpubFromBook'

export const testFunc = async () => {
	const adblocker = AdblockerPlugin({
		blockTrackers: true
	})
	puppeteer.use(adblocker)
	const browser = await puppeteer.launch({
		headless: false,
		ignoreHTTPSErrors: true
	})
	const page = await browser.newPage()
	const epub = await getEpubFromBook(
		'Animal Farm',
		'George Orwell',
		112,
		300000,
		page
	)
	return epub
}

testFunc().then((value) => {
  console.log(value)
})

