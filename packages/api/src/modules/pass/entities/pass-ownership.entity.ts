import { Entity, Index, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { SolNftEntity } from '../../sol/entities/sol-nft.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_ownership' })
@Index({ properties: ['pass', 'holder'] })
export class PassOwnershipEntity extends BaseEntity {
  @OneToOne()
  pass: PassEntity

  @OneToOne()
  holder: UserEntity

  @Property()
  expiresAt?: number

  @OneToOne()
  solNft: SolNftEntity
}
