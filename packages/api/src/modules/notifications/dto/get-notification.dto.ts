import { IsInt, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { NotificationTypeEnum } from '../enum/notification.type.enum'
import { NotificationDto } from './notification.dto'

export class GetNotificationResponseDto extends NotificationDto {}

export class GetNotificationsRequestDto {
  @DtoProperty({ enum: NotificationTypeEnum })
  type?: NotificationTypeEnum

  @IsInt()
  @Min(0)
  @DtoProperty()
  offset: number

  @IsInt()
  @Min(1)
  @DtoProperty()
  limit: number
}

export class GetNotificationsResponseDto {
  @DtoProperty({ type: [NotificationDto] })
  notifications: NotificationDto[]

  constructor(notifications: NotificationDto[]) {
    this.notifications = notifications
  }
}
