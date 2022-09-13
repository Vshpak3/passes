import { IsEnum, IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { NOTIFICATION_MESSAGE_LENGTH } from '../constants/schema'
import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

export class NotificationDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty()
  senderDisplayName: string

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty()
  senderUsername: string

  @IsEnum(NotificationStatusEnum)
  @DtoProperty({ enum: NotificationStatusEnum })
  status: NotificationStatusEnum

  @IsEnum(NotificationTypeEnum)
  @DtoProperty({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum

  @Length(1, NOTIFICATION_MESSAGE_LENGTH)
  @DtoProperty()
  message: string

  @DtoProperty()
  createdAt: Date

  constructor(notification) {
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
