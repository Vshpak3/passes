import { Entity, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'post' })
export class PostEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property({ length: 400 })
  text: string

  @Property({ default: 0 })
  numLikes: number

  @Property({ default: 0 })
  numComments: number

  @Property()
  deletedAt?: Date

  @Property()
  private: boolean

  @Property({ type: types.float })
  price?: number
}
