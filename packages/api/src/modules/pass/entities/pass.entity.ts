import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { CollectionEntity } from '../../collection/entities/collection.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'pass' })
export class PassEntity extends BaseEntity {
  @ManyToOne()
  owner: UserEntity

  @ManyToOne()
  collection: CollectionEntity

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
