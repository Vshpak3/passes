import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { CONTENT_IDS_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

@Entity({ tableName: 'paid_message' })
@Index({ properties: ['createdAt'] })
export class PaidMessageEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  creator: UserEntity

  @Property({ type: types.text, length: MESSAGE_LENGTH })
  text: string

  @Property({ columnType: USD_AMOUNT_TYPE })
  price: number

  @Property({ length: CONTENT_IDS_LENGTH })
  contentIds: string

  @Property({ default: 0 })
  numPurchases: number

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  earningsPurchases: number
}
