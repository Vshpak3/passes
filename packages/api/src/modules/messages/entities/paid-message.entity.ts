import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CONTENTS_LENGTH } from '../../content/constants/schema'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { MESSAGE_LENGTH } from '../constants/schema'

@Entity()
@Index({ properties: ['created_at'] })
export class PaidMessageEntity extends BaseEntity {
  static table = 'paid_message'

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  price: number

  @Property({ length: CONTENTS_LENGTH, default: '[]' })
  contents: string

  @Property({ default: 0 })
  preview_index: number

  @Property({ default: 0 })
  num_purchases: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  earnings_purchases: number

  @Property({ default: 0 })
  sent_to: number

  @Property({ default: 0 })
  viewed: number

  @Property({ length: 3 })
  unsent_at: Date | null

  @Property({ length: 3 })
  hidden_at: Date | null

  @Property({ default: false })
  is_welcome_message: boolean
}
