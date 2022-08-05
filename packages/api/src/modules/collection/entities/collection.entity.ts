import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'collection' })
export class CollectionEntity extends BaseEntity {
  @ManyToOne()
  owner: UserEntity

  // @OneToMany(() => PassEntity, (pass) => pass.collection)
  // passes = new Collection<PassEntity>(this)

  @Property()
  title: string

  @Property()
  description: string

  @Property()
  blockchain: 'solana'
}
