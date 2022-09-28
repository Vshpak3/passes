import { Entity, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import {
  CIRCLE_CLIENT_ID_LENGTH,
  CIRCLE_NOTIFICATION_TYPE_LENGTH,
} from '../constants/schema'

// this table is almost purely for logging and analysis purposes
@Entity({ tableName: 'circle_notification' })
export class CircleNotificationEntity extends BaseEntity {
  @Property({ length: CIRCLE_CLIENT_ID_LENGTH })
  client_id: string

  @Property({ length: CIRCLE_NOTIFICATION_TYPE_LENGTH })
  notification_type: string

  @Property({ type: types.text })
  full_content: string

  @Property()
  processed: boolean | null
}
