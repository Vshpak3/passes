import { Module } from '@nestjs/common'

import { ContentModule } from '../content/content.module'
import { PassModule } from '../pass/pass.module'
import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [PaymentModule, S3ContentModule, PassModule, ContentModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
