import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { SubscriptionEntity } from './entities/subscription.entity'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'

@Module({
  imports: [MikroOrmModule.forFeature([SubscriptionEntity])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
