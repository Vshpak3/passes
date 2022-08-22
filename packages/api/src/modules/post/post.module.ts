import { Module } from '@nestjs/common'

import { PaymentModule } from '../payment/payment.module'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [PaymentModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
