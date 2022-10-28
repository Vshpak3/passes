import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { USD_AMOUNT_TYPE } from '../constants/schema'

@Entity()
export class CreatorFeeEntity extends BaseEntity {
  static table = 'creator_fee'

  @OneToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ type: types.float })
  fiat_rate: number | null

  @Property({ columnType: USD_AMOUNT_TYPE })
  fiat_flat: number | null

  @Property({ type: types.float })
  crypto_rate: number | null

  @Property({ columnType: USD_AMOUNT_TYPE })
  crypto_flat: number | null
}
