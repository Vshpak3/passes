import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { NotificationTypeEnum } from '../enum/notification.type.enum'
import { NotificationDto } from './notification.dto'

export class GetNotificationResponseDto extends NotificationDto {}

export class GetNotificationsRequestDto {
  @DtoProperty({ custom_type: NotificationTypeEnum })
  type?: NotificationTypeEnum

  @Min(0)
  @DtoProperty({ type: 'number' })
  offset: number

  @Min(1)
  @DtoProperty({ type: 'number' })
  limit: number
}

export class GetNotificationsResponseDto {
  @DtoProperty({ custom_type: [NotificationDto] })
  notifications: NotificationDto[]

  constructor(notifications: NotificationDto[]) {
    this.notifications = notifications
  }
}
