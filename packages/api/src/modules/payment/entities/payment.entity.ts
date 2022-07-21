import {
  Entity,
  Enum,
  ManyToOne,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core'
import { InternalServerErrorException } from '@nestjs/common'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CardVerificationEnum } from '../enum/card.verification.enum'
import { PaymentSourceEnum } from '../enum/payment.source.enum'
import { PaymentStatusEnum } from '../enum/payment.status.enum'
import { CardEntity } from './card.entity'
import { CircleAddressEntity } from './circle-address.entity'

@Entity({ tableName: 'payment' })
export class PaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => CardEntity })
  card?: CardEntity

  @ManyToOne({ entity: () => CircleAddressEntity })
  address?: CircleAddressEntity

  @Property()
  @Unique()
  idempotencyKey?: string

  @Property()
  @Unique()
  circlePaymentId: string

  @Property()
  amount: string

  @Enum(() => CardVerificationEnum)
  verification?: CardVerificationEnum

  @Enum(() => PaymentStatusEnum)
  status!: PaymentStatusEnum

  @Enum(() => PaymentSourceEnum)
  source!: PaymentSourceEnum

  async getUser(): Promise<UserEntity> {
    if (this.card) {
      const card = await wrap(this.card).init()
      return await wrap(card.user).init()
    } else if (this.address) {
      const address = await wrap(this.address).init()
      return await wrap(address.user).init()
    } else {
      throw new InternalServerErrorException(
        'impossible data, payment entity has no source',
      )
    }
  }
}
