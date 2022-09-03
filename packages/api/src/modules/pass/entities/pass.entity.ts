import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USD_AMOUNT_TYPE } from '../../payment/constants/schema'
import { SolNftCollectionEntity } from '../../sol/entities/sol-nft-collection.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PASS_DESCRIPTION_LENGTH, PASS_TITLE_LENGTH } from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  creator: UserEntity

  @OneToOne()
  solNftCollection: SolNftCollectionEntity

  @Property({ length: PASS_TITLE_LENGTH })
  title: string

  @Property({ length: PASS_DESCRIPTION_LENGTH })
  description: string

  @Enum(() => PassTypeEnum)
  type: PassTypeEnum

  @Property({ columnType: USD_AMOUNT_TYPE })
  price: number

  @Property()
  totalSupply: number

  @Property({ type: types.bigint })
  duration?: number

  @Property()
  freetrial: boolean

  @Property()
  pinnedAt?: Date

  // null means unlimited
  @Property({ default: 0 })
  messages?: number
}
