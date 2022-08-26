import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { USD_AMOUNT_TYPE } from '../constants/schema'

@Entity({ tableName: 'creator_fee' })
export class CreatorFeeEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  creator: UserEntity

  @Property({ type: types.float })
  fiatRate?: number

  @Property({ type: types.float })
  fiatFlat?: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  cryptoRate?: number

  @Property({ columnType: USD_AMOUNT_TYPE })
  cryptoFlat?: number
}
