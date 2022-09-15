import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { CIRCLE_ID_LENGTH, USD_AMOUNT_TYPE } from '../constants/schema'
import { CirclePaymentEntity } from './circle-payment.entity'

@Entity({ tableName: 'circle_chargeback' })
export class CircleChargebackEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleId: string

  @ManyToOne()
  circlePayment: CirclePaymentEntity

  @Property({ columnType: USD_AMOUNT_TYPE })
  amount?: number
}
