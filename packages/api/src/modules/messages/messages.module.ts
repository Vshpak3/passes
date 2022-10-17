import { forwardRef, Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'

import { ContentModule } from '../content/content.module'
import { ListModule } from '../list/list.module'
import { PassModule } from '../pass/pass.module'
import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { MessagesController } from './messages.controller'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    PaymentModule,
    PassModule,
    forwardRef(() => ListModule),
    ContentModule,
    S3ContentModule,
    RedisModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
