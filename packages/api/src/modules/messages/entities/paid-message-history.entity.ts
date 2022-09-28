import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PaidMessageEntity } from './paid-message.entity'

@Entity({ tableName: 'paid_message_history' })
@Index({ properties: ['created_at'] })
export class PaidMessageHistoryEntity extends BaseEntity {
  @ManyToOne({ entity: () => PaidMessageEntity })
  paid_message_id: string

  @Property()
  num_purchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  earnings_purchases: number
}
