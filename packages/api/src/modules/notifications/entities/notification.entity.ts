import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { NOTIFICATION_MESSAGE_LENGTH } from '../constants/schema'
import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

@Entity()
export class NotificationEntity extends BaseEntity {
  static table = 'notification'

  @ManyToOne({ entity: () => UserEntity })
  user_id: string

  @ManyToOne({ entity: () => UserEntity })
  sender_id: string | null

  @Property({ length: NOTIFICATION_MESSAGE_LENGTH })
  message: string

  @Enum(() => NotificationTypeEnum)
  type: NotificationTypeEnum

  @Enum({
    type: () => NotificationStatusEnum,
    default: NotificationStatusEnum.UNREAD,
  })
  status: NotificationStatusEnum
}
