import { PrismaClient } from '@prisma/client'

export const testFunction = () => {
	const prisma = new PrismaClient()
	const books = prisma.book.findMany({})
	console.log(books)
}

testFunction()
