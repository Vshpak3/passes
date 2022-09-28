import { Entity, ManyToOne, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { PassEntity } from './pass.entity'

@Entity({ tableName: 'user_external_pass' })
@Unique({ properties: ['pass_id', 'user_id'] })
export class UserExternalPassEntity extends BaseEntity {
  @ManyToOne({ entity: () => PassEntity })
  pass_id: string

  @ManyToOne({ entity: () => UserEntity })
  user_id: string
}
