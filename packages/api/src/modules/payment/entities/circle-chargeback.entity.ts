import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CIRCLE_ID_LENGTH } from '../constants/schema'
import { CirclePaymentEntity } from './circle-payment.entity'

@Entity({ tableName: 'circle_chargeback' })
export class CircleChargebackEntity extends BaseEntity {
  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string

  @ManyToOne({ entity: () => CirclePaymentEntity })
  circle_payment_id: string

  @Property({ type: types.text })
  full_content: string

  @Property()
  disputed: boolean | null
}
