import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import {
  PASS_IDS_LENGTH,
  POST_TAGS_LENGTH,
  POST_TEXT_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ type: types.text, length: POST_TEXT_LENGTH })
  text: string

  @Property({ length: POST_TAGS_LENGTH, default: '[]' })
  tags: string

  @Index()
  @Property({ default: 0 })
  numLikes: number

  @Index()
  @Property({ default: 0 })
  numComments: number

  @Index()
  @Property({ default: 0 })
  numPurchases: number

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  earningsPurchases: number

  @Property()
  deletedAt?: Date

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Index()
  @Property()
  expiresAt?: Date

  @Index()
  @Property()
  pinnedAt?: Date

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  totalTipAmount: number

  @Index()
  @Property()
  scheduledAt?: Date

  @Property({ length: PASS_IDS_LENGTH })
  passIds?: string
}
