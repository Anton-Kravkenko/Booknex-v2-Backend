import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UploadService {
	private readonly S3Client = new S3Client({
		region: this.configService.getOrThrow('AWS_REGION'),
		credentials: {
			accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
			secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
		}
	})

	constructor(private readonly configService: ConfigService) {}
	async upload(file: Buffer, filename: string, folder: 'epub' | 'image') {
		if (folder !== 'epub' && folder !== 'image')
			throw new BadRequestException('Invalid folder name').getResponse()
		await this.S3Client.send(
			new PutObjectCommand({
				Bucket: this.configService.get<string>('AWS_BUCKET'),
				Key: `${folder}/${filename}`,
				Body: file,
				ACL: 'public-read',
				ContentType: folder === 'epub' ? 'application/epub+zip' : 'image/jpeg',
				ContentDisposition: 'inline'
			})
		)
		return {
			name: filename
		}
	}
}
