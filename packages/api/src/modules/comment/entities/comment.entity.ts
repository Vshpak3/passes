import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { COMMENT_TAGS_LENGTH, COMMENT_TEXT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'comment' })
export class CommentEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @ManyToOne()
  commenter: UserEntity

  @Property({ length: COMMENT_TEXT_LENGTH })
  text: string

  @Property({ length: COMMENT_TAGS_LENGTH })
  tags: string

  // Is Hidden by Post Owner (creator)
  @Property({ default: false })
  hidden: boolean

  @Property({ default: false })
  blocked: boolean

  @Property({ default: false })
  deactivated: boolean

  // Deleted by commenter
  @Property()
  deletedAt?: Date
}
