import { Entity, OneToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
export class NotificationSettingsEntity extends BaseEntity {
  static table = 'notification_settings'
  @OneToOne({ entity: () => UserEntity })
  user_id: string

  @Property({ default: true })
  direct_message_emails: boolean

  @Property({ default: true })
  passes_emails: boolean

  @Property({ default: true })
  payment_emails: boolean

  @Property({ default: true })
  post_emails: boolean

  @Property({ default: true })
  marketing_emails: boolean

  @Property({ default: true })
  mention_emails: boolean
}
