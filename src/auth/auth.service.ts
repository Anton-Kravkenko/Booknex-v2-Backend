import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from '../prisma.service'
import { UsersService } from '../users/users.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
		private readonly usersService: UsersService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueToken(user.id)

		return {
			user: this.userFields(user),
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.email.split('@')[0]
			}
		})
		const tokens = await this.issueToken(user.id)
		return {
			user: this.userFields(user),
			...tokens
		}
	}

	async refresh(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new BadRequestException('Invalid token')
		const user = await this.usersService.getById(result.id, {
			email: true,
			id: true
		})

		const tokens = await this.issueToken(user.id)
		return {
			user,
			...tokens
		}
	}

	private async issueToken(userId: number) {
		const data = { id: userId }
		return {
			accessToken: this.jwt.sign(data, {
				expiresIn: '1h'
			}),
			refreshToken: this.jwt.sign(data, {
				expiresIn: '10d'
			})
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new NotFoundException('User not found')

		const isPasswordValid = await verify(user.password, dto.password)
		if (!isPasswordValid) throw new BadRequestException('Invalid password')

		return user
	}

	private userFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}
}
