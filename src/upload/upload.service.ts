import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import process from 'process'

@Injectable()
export class UploadService {
	private readonly S3 = new S3Client({
		endpoint: process.env.AWS_ENDPOINT,
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	constructor(private readonly configService: ConfigService) {}
	async upload(
		file: Buffer,
		filename: string,
		folder: 'epubs' | 'books-covers' | 'user-pictures'
	) {
		if (
			folder !== 'books-covers' &&
			folder !== 'epubs' &&
			folder !== 'user-pictures'
		)
			throw new BadRequestException('Invalid folder name').getResponse()

		await this.S3.send(
			new PutObjectCommand({
				Bucket: this.configService.get('AWS_BUCKET'),
				Key: `${folder}/${filename}`,
				Body: file,
				ACL: 'public-read',
				ContentDisposition: 'inline'
			})
		)
		return {
			name: filename
		}
	}
}
