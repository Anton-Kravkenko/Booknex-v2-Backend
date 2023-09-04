import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
	private readonly S3Client = new S3Client({
		region: this.configService.getOrThrow('AWS_REGION'),
		credentials: {
			accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
			secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
		}
	})

	constructor(private readonly configService: ConfigService) {}
	async upload(file: Buffer, filename: string) {
		await this.S3Client.send(
			new PutObjectCommand({
				Bucket: this.configService.get<string>('AWS_BUCKET'),
				Key: filename,
				Body: file,
				ACL: 'public-read',
				ContentType: 'image/jpeg',
				ContentDisposition: 'inline'
			})
		)
		return {
			url: `https://${this.configService.get<string>(
				'AWS_BUCKET'
			)}.s3.amazonaws.com/${filename}`
		}
	}
}
