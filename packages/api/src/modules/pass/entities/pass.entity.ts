import { Entity, Enum, ManyToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { PASS_DESCRIPTION_LENGTH, PASS_TITLE_LENGTH } from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  creator?: UserEntity

  @Property({ length: PASS_TITLE_LENGTH })
  title: string

  @Property({ length: PASS_DESCRIPTION_LENGTH })
  description: string

  @Enum(() => PassTypeEnum)
  type: PassTypeEnum

  @Property({ columnType: USD_AMOUNT_TYPE, default: 0 })
  price: number

  @Property({ type: types.bigint })
  duration?: number

  @Property()
  freetrial: boolean

  @Property()
  pinnedAt?: Date

  @Property()
  totalSupply: number

  @Property({ default: 0 })
  remainingSupply: number

  // null means unlimited
  @Property({ default: 0 })
  messages?: number

  @Property({ length: BLOCKCHAIN_ADDRESS_LENGTH })
  ethAddress?: string
}
