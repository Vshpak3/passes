import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
@Unique({ properties: ['user_id', 'creator_id'] })
export class UserSpendingEntity extends BaseEntity {
  static table = 'user_spending'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ default: 0 })
  amount: number
}
