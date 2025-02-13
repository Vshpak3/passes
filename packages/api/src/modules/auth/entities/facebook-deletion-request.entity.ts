import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { AUTH_FACEBOOK_USER_ID_LENGTH } from '../constants/schema'

// Represents when a (Facebook OAuth) user requests to delete any data we hold about them
// See: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
@Entity()
export class FacebookDeletionRequestEntity extends BaseEntity {
  static table = 'facebook_deletion_request'

  @Property({ length: AUTH_FACEBOOK_USER_ID_LENGTH })
  facebook_user_id: string
}
