import { Module } from '@nestjs/common'

import { PaymentModule } from '../payment/payment.module'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'

@Module({
  imports: [PaymentModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
