import { Module } from '@nestjs/common'

import { S3Module } from '../s3/s3.module'
import { ContentController } from './content.controller'
import { ContentService } from './content.service'

@Module({
  imports: [S3Module],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
