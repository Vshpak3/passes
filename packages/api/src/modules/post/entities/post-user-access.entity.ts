import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PostEntity } from './post.entity'

@Entity({ tableName: 'post_user_access' })
@Unique({ properties: ['post', 'user'] })
export class PostUserAccessEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  user: UserEntity
}
