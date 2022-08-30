import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_purchase' })
@Unique({ properties: ['pass', 'user'] })
export class PassPurchaseEntity extends BaseEntity {
  @ManyToOne()
  pass: PassEntity

  @ManyToOne()
  user: UserEntity
}
