import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { CONTENT_IDS_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

@Entity({ tableName: 'paid_message' })
@Index({ properties: ['created_at'] })
export class PaidMessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  price: number

  @Property({ length: CONTENT_IDS_LENGTH, default: '[]' })
  content_ids: string

  @Property({ default: 0 })
  num_purchases: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  earnings_purchases: number
}
