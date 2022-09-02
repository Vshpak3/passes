import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

import { NotificationStatusEnum } from '../enum/notification.status.enum'
import { NotificationTypeEnum } from '../enum/notification.type.enum'

export class NotificationDto {
  @IsUUID()
  @ApiProperty()
  id: string

  @IsUUID()
  @ApiProperty()
  userId: string

  @ApiProperty()
  senderName: string

  @ApiProperty()
  senderUsername: string

  @ApiProperty({ enum: NotificationStatusEnum })
  status: NotificationStatusEnum

  @ApiProperty({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum

  @ApiProperty()
  message: string

  @ApiProperty()
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
