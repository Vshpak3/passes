import { Module } from '@nestjs/common'

import { S3ContentService } from './s3content.service'

@Module({
  imports: [],
  controllers: [],
  providers: [S3ContentService],
  exports: [S3ContentService],
})
export class S3ContentModule {}
