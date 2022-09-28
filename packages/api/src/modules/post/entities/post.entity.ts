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
  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ type: types.text, length: POST_TEXT_LENGTH })
  text: string

  @Property({ length: POST_TAGS_LENGTH, default: '[]' })
  tags: string

  @Index()
  @Property({ default: 0 })
  num_likes: number

  @Index()
  @Property({ default: 0 })
  num_comments: number

  @Index()
  @Property({ default: 0 })
  num_purchases: number

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  earnings_purchases: number

  @Property()
  deleted_at: Date | null

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Index()
  @Property()
  expires_at: Date | null

  @Index()
  @Property()
  pinned_at: Date | null

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  total_tip_amount: number

  @Index()
  @Property()
  scheduled_at: Date | null

  @Property({ length: PASS_IDS_LENGTH, default: '[]' })
  pass_ids: string
}
