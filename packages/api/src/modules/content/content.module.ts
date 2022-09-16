import { Module } from '@nestjs/common'

import { PassModule } from '../pass/pass.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { ContentController } from './content.controller'
import { ContentService } from './content.service'

@Module({
  imports: [S3ContentModule, PassModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
