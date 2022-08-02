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
import { CircleCardVerificationEnum } from '../enum/circle-card.verification.enum'
import { CirclePaymentSourceEnum } from '../enum/circle-payment.source.enum'
import { CirclePaymentStatusEnum } from '../enum/circle-payment.status.enum'
import { CircleAddressEntity } from './circle-address.entity'
import { CircleCardEntity } from './circle-card.entity'

@Entity({ tableName: 'circle_payment' })
export class CirclePaymentEntity extends BaseEntity {
  @ManyToOne({ entity: () => CircleCardEntity })
  card?: CircleCardEntity

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

  @Enum(() => CircleCardVerificationEnum)
  verification?: CircleCardVerificationEnum

  @Enum(() => CirclePaymentStatusEnum)
  status!: CirclePaymentStatusEnum

  @Enum(() => CirclePaymentSourceEnum)
  source!: CirclePaymentSourceEnum

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
