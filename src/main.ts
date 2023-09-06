import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('/api')
	app.enableCors()
	app.useGlobalPipes(new ValidationPipe())
	app.use(helmet())
	await app.listen(7777)
}
bootstrap()
