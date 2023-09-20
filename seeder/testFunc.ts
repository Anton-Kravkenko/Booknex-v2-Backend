import { PrismaClient } from '@prisma/client'
import JsonBooks from './books_1.Best_Books_Ever.json'

export const testFunc = async () => {
	const prisma = new PrismaClient()
	const books = JSON.parse(JSON.stringify(JsonBooks))
}

testFunc().then((value) => {
  console.log(value)
})

