import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'pass_purchase' })
@Unique({ properties: ['pass_id', 'user_id'] })
export class PassPurchaseEntity extends BaseEntity {
  @ManyToOne({ entity: () => PassEntity })
  pass_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string
}
