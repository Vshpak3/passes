import { Entity, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

@Entity({ tableName: 'facebook_deletion_request' })
// Represents when a (Facebook OAuth) user requests to delete any data we hold about them
// See: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
export class FacebookDeletionRequestEntity extends BaseEntity {
  @Property()
  facebookUserId: string
}
