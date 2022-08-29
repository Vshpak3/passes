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
import { PassTypeEnum } from '../enum/pass.enum'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  creator: UserEntity

  @OneToOne()
  solNftCollection: SolNftCollectionEntity

  @Property({ length: 255 })
  title: string

  @Property({ length: 255 })
  description: string

  @Property({ length: 255 })
  imageUrl: string

  @Enum(() => PassTypeEnum)
  type: PassTypeEnum

  @Property({ columnType: USD_AMOUNT_TYPE })
  price: number

  @Property()
  totalSupply: number

  @Property({ type: types.bigint })
  duration?: number
}
