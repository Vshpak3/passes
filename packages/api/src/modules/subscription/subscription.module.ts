import { Module } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionEntity } from './entities/subscription.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([SubscriptionEntity])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
