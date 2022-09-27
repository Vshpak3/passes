import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { MESSAGE_LENGTH } from '../constants/schema'

export class MessageDto {
  @DtoProperty({ type: 'uuid' })
  messageId: string

  @DtoProperty({ type: 'uuid' })
  senderId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @DtoProperty({ custom_type: [ContentDto] })
  contents: ContentDto[]

  @DtoProperty({ type: 'uuid' })
  channelId: string

  @Min(0)
  @DtoProperty({ type: 'number', optional: true })
  tipAmount?: number

  @DtoProperty({ type: 'boolean' })
  paid: boolean

  @DtoProperty({ type: 'boolean' })
  pending: boolean

  @DtoProperty({ type: 'boolean' })
  reverted: boolean

  @DtoProperty({ type: 'date' })
  sentAt: Date

  constructor(message, contents) {
    if (message) {
      this.text = message.text
      this.senderId = message.senderId
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
      this.sentAt = message.sent_at
      this.messageId = message.id
      this.reverted = message.reverted
    }
    this.contents = contents
  }
}
