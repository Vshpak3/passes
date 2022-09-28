import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { NOTIFICATION_MESSAGE_LENGTH } from '../constants/schema'
import { NotificationEntity } from '../entities/notification.entity'
import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

export class NotificationDto {
  @DtoProperty({ type: 'uuid' })
  id: string

  @DtoProperty({ type: 'uuid' })
  userId: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string' })
  senderDisplayName: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string' })
  senderUsername: string

  @DtoProperty({ custom_type: NotificationStatusEnum })
  status: NotificationStatusEnum

  @DtoProperty({ custom_type: NotificationTypeEnum })
  type: NotificationTypeEnum

  @Length(1, NOTIFICATION_MESSAGE_LENGTH)
  @DtoProperty({ type: 'string' })
  message: string

  @DtoProperty({ type: 'date' })
  createdAt: Date

  constructor(
    notification:
      | (NotificationEntity & {
          sender_display_name: string
          sender_username: string
        })
      | undefined,
  ) {
    if (notification) {
      this.id = notification.id
      this.userId = notification.user_id
      this.senderDisplayName = notification.sender_display_name
      this.senderUsername = notification.sender_username
      this.status = notification.status
      this.type = notification.type
      this.message = notification.message
      this.createdAt = notification.created_at
    }
  }
}
