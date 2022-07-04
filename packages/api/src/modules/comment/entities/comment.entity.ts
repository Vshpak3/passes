import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: 150 })
  content: string
}
