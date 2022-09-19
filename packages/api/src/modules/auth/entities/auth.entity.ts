import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { USER_EMAIL_LENGTH } from '../../user/constants/schema'
import { UserEntity } from '../../user/entities/user.entity'
import {
  AUTH_OAUTH_ID_LENGTH,
  AUTH_OAUTH_PROVIDER_LENGTH,
  AUTH_PASSWORD_HASH_LENGTH,
} from '../constants/schema'

@Entity({ tableName: 'auth' })
@Index({ properties: ['oauthId', 'oauthProvider'] })
export class AuthEntity extends BaseEntity {
  @Property({ length: AUTH_PASSWORD_HASH_LENGTH })
  passwordHash?: string

  @Property({ length: AUTH_OAUTH_PROVIDER_LENGTH })
  oauthProvider?: string

  @Property({ length: AUTH_OAUTH_ID_LENGTH })
  oauthId?: string

  // Duplicate of user email field; only used for auth purposes
  @Index()
  @Property({ length: USER_EMAIL_LENGTH })
  email?: string

  @Property({ default: false })
  isEmailVerified = false

  @ManyToOne()
  user?: UserEntity
}
