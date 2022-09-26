import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_history' })
@Index({ properties: ['createdAt'] })
export class PostHistoryEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @Property()
  numLikes: number

  @Property()
  numComments: number

  @Property()
  numPurchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  earningsPurchases: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  totalTipAmount: number
}
