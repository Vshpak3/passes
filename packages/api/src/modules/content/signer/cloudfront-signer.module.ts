import { Module } from '@nestjs/common'

import { CloudFrontSignerService } from './cloudfront-signer.service'

@Module({
  imports: [],
  controllers: [],
  providers: [CloudFrontSignerService],
})
export class CloudFrontSignerModule {}
