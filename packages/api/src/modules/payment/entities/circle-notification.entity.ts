import { Entity, Property, types } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'

// this table is almost purely for logging and analysis purposes
@Entity({ tableName: 'circle_notification' })
export class CircleNotificationEntity extends BaseEntity {
  @Property()
  clientId: string

  @Property()
  notificationType: string

  @Property({ type: types.text })
  fullContent: string

  @Property()
  processed?: boolean
}
