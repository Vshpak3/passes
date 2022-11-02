import { MiddlewareConsumer, Module } from '@nestjs/common'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { text } from 'body-parser'

import { CreatorStatsModule } from '../creator-stats/creator-stats.module'
import { EmailModule } from '../email/email.module'
import { EthModule } from '../eth/eth.module'
import { RedisLockModule } from '../redis-lock/redis-lock.module'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    CreatorStatsModule,
    RedisLockModule,
    EmailModule,
    EthModule,
    SentryModule,
    EmailModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(text()).forRoutes('/payment/circle/notification')
  }
}
