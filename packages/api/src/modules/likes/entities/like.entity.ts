import { Entity, Index, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'post_like' })
@Unique({ properties: ['post_id', 'liker_id'] })
@Index({ properties: ['created_at'] })
export class LikeEntity extends BaseEntity {
  @ManyToOne({ entity: () => PostEntity })
  post_id: string

  @ManyToOne({ entity: () => UserEntity })
  liker_id: string
}
