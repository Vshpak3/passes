import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'content' })
export class ContentEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property()
  url: string

  @Property()
  contentType: string
}
