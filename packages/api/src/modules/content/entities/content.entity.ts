import { Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ListEntity } from '../../list/entities/list.entity'
import { PostEntity } from '../../post/entities/post.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'content' })
export class ContentEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @ManyToMany()
  post: PostEntity

  @Property({ length: 255 })
  url: string

  @Property({ length: 255 })
  contentType: string

  @ManyToMany()
  list: ListEntity
}
