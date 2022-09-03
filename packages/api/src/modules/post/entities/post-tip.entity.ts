import { Entity, Index, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_tip' })
@Index({ properties: ['post', 'user'] })
export class PostTipEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToOne()
  post: PostEntity

  @Index()
  @Property({ type: types.float })
  amount: number
}
