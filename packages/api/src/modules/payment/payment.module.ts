import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { UserEntity } from '../user/entities/user.entity'
import { BankEntity } from './entities/bank.entity'
import { CardEntity } from './entities/card.entity'
import { CircleAddressEntity } from './entities/circle.address.entity'
import { PaymentEntity } from './entities/payment.entity'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CardEntity,
      UserEntity,
      PaymentEntity,
      CircleAddressEntity,
      BankEntity,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
