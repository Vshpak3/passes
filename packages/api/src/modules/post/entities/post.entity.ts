import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { POST_CONTENT_LENGTH } from '../constants/schema'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToMany(() => ContentEntity, (content) => content.post)
  content = new Collection<ContentEntity>(this)

  @Property({ length: POST_CONTENT_LENGTH })
  text: string

  @Property({ default: 0 })
  numLikes

  @Property({ default: 0 })
  numComments

  @Property()
  deletedAt?: Date

  @Property()
  private: boolean

  @Property({ type: types.float })
  price?: number
}
