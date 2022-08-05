import { Module } from '@nestjs/common'

import { ContentService } from './content.service'
import { CloudFrontSignerModule } from './signer/cloudfront-signer.module'

@Module({
  imports: [CloudFrontSignerModule],
  controllers: [],
  providers: [ContentService],
})
export class ContentModule {}
