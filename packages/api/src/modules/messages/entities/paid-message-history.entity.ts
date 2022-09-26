import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PaidMessageEntity } from './paid-message.entity'

@Entity({ tableName: 'paid_message_history' })
@Index({ properties: ['createdAt'] })
export class PaidMessageHistoryEntity extends BaseEntity {
  @ManyToOne()
  paidMessage: PaidMessageEntity

  @Property()
  numPurchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  earningsPurchases: number
}
