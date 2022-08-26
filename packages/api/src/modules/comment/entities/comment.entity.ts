import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { COMMENT_CONTENT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: COMMENT_CONTENT_LENGTH })
  content: string

  // Is Hidden by Post Owner (creator)
  @Property({ default: false })
  isHidden = false

  // Deleted by commenter
  @Property()
  deletedAt?: Date
}
