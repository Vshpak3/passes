import { Entity, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'post_like' })
export class LikeEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  liker: UserEntity
}
