import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { MessageEntity } from '../entities/message.entity'
import { MessageDto } from './message.dto'

export class MessageNotificationDto extends MessageDto {
  @DtoProperty({ type: 'uuid' })
  recieverId: string

  constructor(
    message: MessageEntity | undefined,
    contents: ContentDto[],
    receiverId: string,
  ) {
    super(message, contents)
    this.recieverId = receiverId
  }
}
