import { MiddlewareConsumer, Module } from '@nestjs/common'
import { text } from 'body-parser'

import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(text()).forRoutes('/payment/circle/notification')
  }
}
