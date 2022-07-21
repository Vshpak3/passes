import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'circle_address' })
@Filter({
  name: 'expiration',
  cond: (args) => ({
    expiration: { $gt: args.date },
  }),
})
export class CircleAddressEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property()
  address: string

  @Property()
  expiration: Date
}
