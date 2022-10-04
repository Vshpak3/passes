import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { PassEntity } from '../../pass/entities/pass.entity'
import { USER_EMAIL_LENGTH } from '../constants/schema'

@Entity({ tableName: 'whitelisted_users' })
@Unique({ properties: ['email', 'pass_id'] })
export class WhitelistedUserEntity extends BaseEntity {
  @Property({ length: USER_EMAIL_LENGTH })
  email: string

  @ManyToOne({ entity: () => PassEntity })
  pass_id: string

  @Property({ default: false })
  created: boolean
}
