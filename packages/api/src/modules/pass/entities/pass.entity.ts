import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftCollectionEntity } from '../../sol/entities/sol-nft-collection.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  owner: UserEntity

  @OneToOne()
  solNftCollection: SolNftCollectionEntity

  @Property()
  title: string

  @Property()
  description: string

  @Property()
  imageUrl: string

  @Property()
  type: 'subscription' | 'lifetime'

  @Property()
  price: number

  @Property()
  totalSupply: number
}
