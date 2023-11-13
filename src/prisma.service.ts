import type { OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private static instance: PrismaService

	constructor() {
		super()
		if (!PrismaService.instance) {
			PrismaService.instance = this
		}

		return PrismaService.instance
	}

	async onModuleInit() {
		await this.$connect()
	}
}

let prisma: PrismaService

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaService()
} else {
	if (!global.prisma) {
		global.prisma = new PrismaService()
	}

	prisma = global.prisma
}

export default prisma
