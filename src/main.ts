import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('/api')
	app.enableCors({})
	app.useGlobalPipes(new ValidationPipe())
	app.use(helmet())
	const config = new DocumentBuilder()
		.setTitle('Booknex')
		.setDescription('The Booknex API')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			persistAuthorization: true
		},
		customSiteTitle: 'Booknex API'
	})
	await app.listen(7777)
}
bootstrap()
