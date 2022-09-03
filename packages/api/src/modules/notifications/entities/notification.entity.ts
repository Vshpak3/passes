import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'

import { BaseEntity } from '../../../database/base-entity'
import { UserEntity } from '../../user/entities/user.entity'
import { NOTIFICATION_CONTENT_LENGTH } from '../constants/schema'
import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

@Entity({ tableName: 'notification' })
export class NotificationEntity extends BaseEntity {
  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity

  @ManyToOne({ entity: () => UserEntity })
  sender?: UserEntity

  @Property({ length: NOTIFICATION_CONTENT_LENGTH })
  message: string

  @Enum(() => NotificationTypeEnum)
  type: NotificationTypeEnum

  @Enum({
    type: () => NotificationStatusEnum,
    default: NotificationStatusEnum.UNREAD,
  })
  status: NotificationStatusEnum
}
