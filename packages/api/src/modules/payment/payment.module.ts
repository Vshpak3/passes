import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { text } from 'body-parser'

import { UserModule } from '../user/user.module'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [MikroOrmModule.forFeature([], 'ReadWrite'), UserModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(text()).forRoutes('/payment/circle/notification')
  }
}
