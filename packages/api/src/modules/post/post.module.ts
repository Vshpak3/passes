import { Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'

import { ContentModule } from '../content/content.module'
import { EmailModule } from '../email/email.module'
import { PassModule } from '../pass/pass.module'
import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { PostController } from './post.controller'
import { PostGateway } from './post.gateway'
import { PostService } from './post.service'

@Module({
  imports: [
    PaymentModule,
    S3ContentModule,
    PassModule,
    ContentModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostGateway],
  exports: [PostService],
})
export class PostModule {}
