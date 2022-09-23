import { forwardRef, Module } from '@nestjs/common'

import { ContentModule } from '../content/content.module'
import { ListModule } from '../list/list.module'
import { PassModule } from '../pass/pass.module'
import { PaymentModule } from '../payment/payment.module'
import { S3ContentModule } from '../s3content/s3content.module'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    PaymentModule,
    PassModule,
    forwardRef(() => ListModule),
    ContentModule,
    S3ContentModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
