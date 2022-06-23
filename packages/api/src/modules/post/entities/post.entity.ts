import { Entity, Property, ManyToOne } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property()
  numLikes: number

  @Property()
  numComments: number
}
