import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ tableName: 'notification_settings' })
export class NotificationSettingsEntity extends BaseEntity {
  @OneToOne({ entity: () => UserEntity })
  user: UserEntity

  @Property({ default: true })
  directMessageEmails: boolean

  @Property({ default: true })
  passesEmails: boolean

  @Property({ default: true })
  paymentEmails: boolean

  @Property({ default: true })
  postEmails: boolean

  @Property({ default: true })
  marketingEmails: boolean

  @Property({ default: true })
  mentionEmails: boolean
}
