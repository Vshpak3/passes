import { Entity, ManyToOne, Property, types, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CIRCLE_ID_LENGTH } from '../constants/schema'
import { CirclePaymentEntity } from './circle-payment.entity'

@Entity()
export class CircleChargebackEntity extends BaseEntity {
  static table = 'circle_chargeback'

  @Property({ length: CIRCLE_ID_LENGTH })
  @Unique()
  circle_id: string

  @ManyToOne({ entity: () => CirclePaymentEntity })
  circle_payment_id: string

  @Property({ type: types.text })
  full_content: string

  @Property()
  disputed: boolean | null

  @Property({ default: 0 })
  processed: number
}
