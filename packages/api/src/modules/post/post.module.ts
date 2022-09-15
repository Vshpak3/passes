import { Module } from '@nestjs/common'

import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [PaymentModule, S3ContentModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
