import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'creator_stat' })
export class CreatorStatEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ default: 0 })
  numFollowers: number

  @Property({ default: 0 })
  numLikes: number
}
