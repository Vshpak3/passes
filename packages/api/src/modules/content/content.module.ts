import { Module } from '@nestjs/common'

import { S3ContentModule } from '../s3content/s3content.module'
import { ContentController } from './content.controller'
import { ContentService } from './content.service'

@Module({
  imports: [S3ContentModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
