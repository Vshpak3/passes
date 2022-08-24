import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'creator_fee' })
export class CreatorFeeEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  creator: UserEntity

  @Property({ type: types.float })
  fiatRate?: number

  @Property({ type: types.float })
  fiatFlat?: number

  @Property({ type: types.float })
  cryptoRate?: number

  @Property({ type: types.float })
  cryptoFlat?: number
}
