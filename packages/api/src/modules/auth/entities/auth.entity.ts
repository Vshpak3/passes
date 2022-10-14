import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import {
  AUTH_OAUTH_ID_LENGTH,
  AUTH_OAUTH_PROVIDER_LENGTH,
  AUTH_PASSWORD_HASH_LENGTH,
} from '../constants/schema'

@Entity()
@Index({ properties: ['oauth_id', 'oauth_provider'] })
export class AuthEntity extends BaseEntity {
  static table = 'auth'
  @Property({ length: AUTH_PASSWORD_HASH_LENGTH })
  password_hash: string | null

  @Property({ length: AUTH_OAUTH_PROVIDER_LENGTH })
  oauth_provider: string | null

  @Property({ length: AUTH_OAUTH_ID_LENGTH })
  oauth_id: string | null

  // Duplicate of user email field; only used for auth purposes
  @Index()
  @Property({ length: USER_EMAIL_LENGTH })
  email: string | null

  @Property({ default: false })
  is_email_verified = false

  @ManyToOne({ entity: () => UserEntity })
  user_id: string | null
}
