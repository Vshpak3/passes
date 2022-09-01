import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

import { NotificationTypeEnum } from '../enum/notification.type.enum'
import { NotificationDto } from './notification.dto'

export class GetNotificationResponseDto extends NotificationDto {}

export class GetNotificationsRequestDto {
  @ApiProperty({ enum: NotificationTypeEnum })
  type?: NotificationTypeEnum

  @IsInt()
  @Min(0)
  @ApiProperty()
  offset: number

  @IsInt()
  @Min(1)
  @ApiProperty()
  limit: number
}

export class GetNotificationsResponseDto {
  @ApiProperty({ type: [NotificationDto] })
  notifications: NotificationDto[]

  constructor(notifications: NotificationDto[]) {
    this.notifications = notifications
  }
}
