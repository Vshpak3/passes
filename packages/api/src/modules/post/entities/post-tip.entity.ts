import { Entity, Index, ManyToOne, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PayinEntity } from '../../payment/entities/payin.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from './post.entity'

@Entity()
@Index({ properties: ['post_id', 'user_id'] })
export class PostTipEntity extends BaseEntity {
  static table = 'post_tip'
  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @OneToOne({ entity: () => PayinEntity })
  payin_id: string

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number
}
