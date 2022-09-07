import { MiddlewareConsumer, Module } from '@nestjs/common'
import { text } from 'body-parser'

import { CreatorStatsModule } from '../creator-stats/creator-stats.module'
import { RedisLockModule } from '../redisLock/redisLock.module'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [CreatorStatsModule, RedisLockModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(text()).forRoutes('/payment/circle/notification')
  }
}
