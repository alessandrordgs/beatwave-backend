import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
@Injectable()
export class StorageService {
  private client: S3Client;
  private bucketName = process.env.R2_BUCKET;
  constructor() {
    this.client = new S3Client({
      region: process.env.R2_REGION,
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile({
    file,
    isPublic,
  }: {
    file: Express.Multer.File;
    isPublic: boolean;
  }) {
    try {
      const key = `${Date.now()}_${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',

        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.client.send(command);

      return {
        url: `https://beatwave-bucket.alessandrordgs.com.br/${key}`,
        key: key,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeFile(key: string) {
    try {
      const commad = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(commad);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
