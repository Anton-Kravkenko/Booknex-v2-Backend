import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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

	const epubFile = await fetch(typeof epub === 'string' ? epub : epub.link)
	const arrayBuffer = await epubFile.arrayBuffer()
	const epubBuffer = Buffer.from(arrayBuffer)

	const s3 = new S3Client({
		endpoint: 'https://s3.us-east-005.backblazeb2.com',
		region: 'us-east-005',
		credentials: {
			accessKeyId: '005a7e122b851dd0000000001',
			secretAccessKey: 'K005NDRcNW9kn8JWlixdUbqnKrCMzX0'
		}
	})
	await s3.send(
		new PutObjectCommand({
			Bucket: 'Booknex',
			Key: `epubs/${'Animal Farm'}.epub`,
			Body: epubBuffer,
			ACL: 'public-read',
			ContentType: 'application/epub+zip',
			ContentDisposition: 'inline'
		})
	)
}

testFunc().then((value) => {
  console.log(value)
})

