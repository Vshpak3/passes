import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { CircleAddressEntity } from './entities/circle-address.entity'
import { CircleBankEntity } from './entities/circle-bank.entity'
import { CircleCardEntity } from './entities/circle-card.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { CirclePaymentEntity } from './entities/circle-payment.entity'
import { DefaultPayinEntity } from './entities/default-payin.entity'
import { PaymentEntity } from './entities/payment.entity'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CircleCardEntity,
      CirclePaymentEntity,
      CircleAddressEntity,
      CircleBankEntity,
      CircleNotificationEntity,
      PaymentEntity,
      DefaultPayinEntity,
    ]),
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
