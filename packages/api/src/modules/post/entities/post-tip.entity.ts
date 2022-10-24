import { Entity, Index, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from './post.entity'

@Entity()
@Unique({ properties: ['post_id', 'user_id'] })
export class PostTipEntity extends BaseEntity {
  static table = 'post_tip'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number
}
