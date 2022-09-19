import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { AuthEntity } from '../../auth/entities/auth.entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'

@Entity({ tableName: 'reset_password_request' })
export class ResetPasswordRequestEntity extends BaseEntity {
  @ManyToOne()
  auth: AuthEntity

  @Property({ length: USER_EMAIL_LENGTH })
  email: string

  @Property()
  usedAt?: Date
}
