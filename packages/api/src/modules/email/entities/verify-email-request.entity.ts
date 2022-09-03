import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'verify_email_request' })
export class VerifyEmailRequestEntity extends BaseEntity {
  @ManyToOne()
  user: UserEntity

  @Property()
  expiresAt: Date

  @Property()
  usedAt?: Date
}
