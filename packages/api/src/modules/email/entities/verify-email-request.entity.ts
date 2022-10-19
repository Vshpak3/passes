import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { AuthEntity } from '../../auth/entities/auth.entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'

@Entity()
export class VerifyEmailRequestEntity extends BaseEntity {
  static table = 'verify_email_request'

  @ManyToOne({ entity: () => AuthEntity })
  auth_id: string

  @Property({ length: USER_EMAIL_LENGTH })
  email: string

  @Property({ length: 3 })
  used_at: Date | null
}
