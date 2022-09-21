import { Entity, Index, ManyToOne, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { PayinEntity } from '../../payment/entities/payin.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_tip' })
@Index({ properties: ['post', 'user'] })
export class PostTipEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToOne()
  post: PostEntity

  @OneToOne()
  payin: PayinEntity

  @Index()
  @Property({ columnType: USD_AMOUNT_TYPE })
  amount: number
}
