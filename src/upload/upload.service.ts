import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import process from 'node:process'
import { StorageFolderType } from './global.types'

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

	async delete(filename: string) {
		if (!filename)
			throw new BadRequestException('Invalid filename').getResponse()
		await this.S3.send(
			new DeleteObjectCommand({
				Bucket: this.configService.get('AWS_BUCKET'),
				Key: filename
			})
		).catch(() => {
			throw new BadRequestException('File not found').getResponse()
		})
		return {
			message: 'File deleted'
		}
	}

	async upload(file: Buffer, filename: string, folder: StorageFolderType) {
		if (!['epubs', 'books-covers', 'user-pictures'].includes(folder))
			throw new BadRequestException('Invalid folder name').getResponse()

		await this.S3.send(
			new PutObjectCommand({
				Bucket: this.configService.get('AWS_BUCKET'),
				Key: `${folder}/${filename}`,
				Body: file,
				ACL: 'public-read',
				ContentDisposition: 'inline'
			})
		).catch(() => {
			throw new BadRequestException('File not uploaded').getResponse()
		})
		return {
			name: filename
		}
	}
}
