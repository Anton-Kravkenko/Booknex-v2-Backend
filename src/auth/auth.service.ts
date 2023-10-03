import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { AuthDto, RegisterDto } from './dto/auth.dto'
import { randomPicture } from './random-picture'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
		private readonly usersService: UserService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueToken(user.id)

		return {
			user: this.userFields(user),
			...tokens
		}
	}

	async checkEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		})
		return {
			isExist: !!user
		}
	}

	async register(dto: RegisterDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (oldUser)
			throw new BadRequestException('User already exists').getResponse()
		const fainBackPicture = randomPicture()
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.name ?? dto.email.split('@')[0],
				picture: fainBackPicture,
				initialGenre: {
					connectOrCreate: dto.genres.map(genre => ({
						where: {
							name: genre
						},
						create: {
							name: genre
						}
					}))
				}
			}
		})
		const tokens = this.issueToken(user.id)
		return {
			user: this.userFields(user),
			...tokens
		}
	}

	async refresh(refreshToken: string) {
		const result: { id: number } = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new BadRequestException('Invalid token').getResponse()
		const user = await this.usersService.getUserById(result.id, {
			email: true,
			id: true
		})

		const tokens = this.issueToken(user.id)
		return {
			user,
			...tokens
		}
	}

	private issueToken(userId: number) {
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
		if (!user)
			throw new NotFoundException(
				"Email or password doesn't work"
			).getResponse()

		const isPasswordValid = await verify(user.password, dto.password)
		if (!isPasswordValid)
			throw new BadRequestException(
				"Email or password doesn't work"
			).getResponse()

		return user
	}

	private userFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}
}
