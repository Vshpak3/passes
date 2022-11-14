import { DtoProperty } from '../../../web/dto.web'
import { PassEntity } from '../entities/pass.entity'
import { PassHolderEntity } from '../entities/pass-holder.entity'
import { PassNotificationEnum } from '../enum/pass.notification.enum'
import { PassHolderDto } from './pass-holder.dto'

export class PassHolderNotificationDto extends PassHolderDto {
  @DtoProperty({ type: 'uuid' })
  recieverId: string

  @DtoProperty({ custom_type: PassNotificationEnum })
  notification: PassNotificationEnum

  constructor(
    passHolder:
      | (PassHolderEntity &
          PassEntity & {
            holder_username?: string
            holder_display_name?: string
            total_messages: number | null
          })
      | undefined,
    notification: PassNotificationEnum,
  ) {
    super(passHolder)
    this.recieverId = passHolder?.holder_id ?? ''
    this.notification = notification
  }
}
