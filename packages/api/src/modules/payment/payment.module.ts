import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle-address.entity'
import { CircleNotificationEntity } from './entities/circle-notification.entity'
import { PaymentEntity } from './entities/payment.entity'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CardEntity,
      PaymentEntity,
      CircleAddressEntity,
      BankEntity,
      CircleNotificationEntity,
    ]),
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
