import { PrismaClient } from '@prisma/client'

export const testFunc = async () => {
	const prisma = new PrismaClient()
}

testFunc().then(value => {
	console.log(value)
})
