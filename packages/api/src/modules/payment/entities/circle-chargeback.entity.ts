import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CIRCLE_ID_LENGTH } from '../constants/schema'
import { CirclePaymentEntity } from './circle-payment.entity'

@Entity({ tableName: 'circle_chargeback' })
export class CircleChargebackEntity extends BaseEntity {
  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circleId: string

  @ManyToOne()
  circlePayment: CirclePaymentEntity

  @Property({ type: types.text })
  fullContent: string

  @Property()
  disputed?: boolean
}
