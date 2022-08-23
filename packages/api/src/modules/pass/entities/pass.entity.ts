import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
  types,
} from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftCollectionEntity } from '../../sol/entities/sol-nft-collection.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassTypeEnum } from '../enum/pass.enum'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  creator: UserEntity

  @OneToOne()
  solNftCollection: SolNftCollectionEntity

  @Property()
  title: string

  @Property()
  description: string

  @Property()
  imageUrl: string

  @Enum(() => PassTypeEnum)
  type: PassTypeEnum

  @Property({ type: types.float })
  price: number

  @Property()
  totalSupply: number

  @Property({ type: types.bigint })
  duration: number
}
