import { Entity, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { USD_AMOUNT_TYPE } from '../constants/schema'

@Entity({ tableName: 'creator_fee' })
export class CreatorFeeEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  creator_id: string

  @Property({ type: types.float })
  fiat_rate: number | null

  @Property({ type: types.float })
  fiat_flat: number | null

  @Property({ columnType: USD_AMOUNT_TYPE })
  crypto_rate: number | null

  @Property({ columnType: USD_AMOUNT_TYPE })
  crypto_flat: number | null
}
