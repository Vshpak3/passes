import { Entity, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { AuthEntity } from '../../auth/entities/auth.entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'

@Entity({ tableName: 'verify_email_request' })
export class VerifyEmailRequestEntity extends BaseEntity {
  @ManyToOne({ entity: () => AuthEntity })
  auth_id: string

  @Property({ length: USER_EMAIL_LENGTH })
  email: string

  @Property()
  used_at: Date | null
}
