import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/endpoint.web'
import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

export class NotificationDto {
  @IsUUID()
  @DtoProperty()
  id: string

  @IsUUID()
  @DtoProperty()
  userId: string

  @DtoProperty()
  senderName: string

  @DtoProperty()
  senderUsername: string

  @DtoProperty({ enum: NotificationStatusEnum })
  status: NotificationStatusEnum

  @DtoProperty({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum

  @DtoProperty()
  message: string

  @DtoProperty()
  createdAt: Date

  constructor(notification) {
    if (notification) {
      this.id = notification.id
      this.userId = notification.user_id
      this.senderName = notification.sender_name
      this.senderUsername = notification.sender_username
      this.status = notification.status
      this.type = notification.type
      this.message = notification.message
      this.createdAt = notification.created_at
    }
  }
}
