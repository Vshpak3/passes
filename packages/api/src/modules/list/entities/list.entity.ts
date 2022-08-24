import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { ContentEntity } from '../../content/entities/content.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'list' })
export class ListEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 255 })
  name: string

  @ManyToMany(() => ContentEntity, (content) => content.list)
  content = new Collection<ListEntity>(this)
}
