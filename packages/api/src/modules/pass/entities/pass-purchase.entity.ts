import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity()
@Unique({ properties: ['pass_id', 'user_id'] })
export class PassPurchaseEntity extends BaseEntity {
  static table = 'pass_purchase'
  @ManyToOne({ entity: () => PassEntity })
  pass_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string
}
