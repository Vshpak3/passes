import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import {
  COLLECTION_DESCRIPTION_LENGTH,
  COLLECTION_TITLE_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'collection' })
export class CollectionEntity extends BaseEntity {
  @ManyToOne()
  owner: UserEntity

  // @OneToMany(() => PassEntity, (pass) => pass.collection)
  // passes = new Collection<PassEntity>(this)

  @Property({ length: COLLECTION_TITLE_LENGTH })
  title: string

  @Property({ length: COLLECTION_DESCRIPTION_LENGTH })
  description: string

  @Enum(() => ChainEnum)
  blockchain: ChainEnum
}
