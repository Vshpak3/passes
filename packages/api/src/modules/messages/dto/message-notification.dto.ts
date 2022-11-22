import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { MessageEntity } from '../entities/message.entity'
import { MessageNotificationEnum } from '../enum/message.notification.enum'
import { MessageDto } from './message.dto'

export class MessageNotificationDto extends MessageDto {
  @DtoProperty({ type: 'uuid' })
  receiverId: string

  @DtoProperty({ custom_type: MessageNotificationEnum })
  notification: MessageNotificationEnum

  constructor(
    message: MessageEntity | undefined,
    contents: ContentDto[],
    receiverId: string,
    notification: MessageNotificationEnum,
  ) {
    super(message, contents)
    this.receiverId = receiverId
    this.notification = notification
  }
}
