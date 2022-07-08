import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PostEntity } from '../../post/entities/post.entity'

@Entity({ tableName: 'content' })
export class ContentEntity extends BaseEntity {
  @ManyToOne()
  post: PostEntity

  @Property()
  url: string

  @Property()
  contentType: string
}
