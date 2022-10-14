import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PostEntity } from './post.entity'

@Entity()
@Index({ properties: ['created_at'] })
export class PostHistoryEntity extends BaseEntity {
  static table = 'post_history'
  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @Property()
  num_likes: number

  @Property()
  num_comments: number

  @Property()
  num_purchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  earnings_purchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  total_tip_amount: number
}
