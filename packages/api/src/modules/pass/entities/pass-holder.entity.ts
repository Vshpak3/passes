import { Entity, ManyToOne, OneToOne, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftEntity } from '../../sol/entities/sol-nft.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_holder' })
export class PassHolderEntity extends BaseEntity {
  @ManyToOne()
  pass: PassEntity

  @ManyToOne()
  holder: UserEntity

  @Property({ type: types.bigint })
  expiresAt?: number

  @OneToOne()
  solNft?: SolNftEntity
}
