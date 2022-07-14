import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'gem_balance' })
export class GemBalanceEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  amount = 0
}
