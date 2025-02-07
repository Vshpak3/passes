import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { MESSAGE_LENGTH } from '../constants/schema'
import { MessageEntity } from '../entities/message.entity'

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

  @DtoProperty({ type: 'number' })
  previewIndex: number

  @DtoProperty({ type: 'uuid' })
  channelId: string

  @Min(0)
  @DtoProperty({ type: 'currency', optional: true })
  tipAmount?: number

  @DtoProperty({ type: 'date', nullable: true, optional: true })
  paidAt?: Date | null

  @DtoProperty({ type: 'boolean' })
  paying: boolean

  @DtoProperty({ type: 'boolean' })
  pending: boolean

  @DtoProperty({ type: 'currency' })
  price: number

  @DtoProperty({ type: 'boolean' })
  reverted: boolean

  @DtoProperty({ type: 'boolean' })
  automatic: boolean

  @DtoProperty({ type: 'date' })
  sentAt: Date

  @DtoProperty({ type: 'boolean' })
  contentProcessed: boolean

  constructor(message: MessageEntity | undefined, contents: ContentDto[]) {
    if (message) {
      this.text = message.text
      this.senderId = message.sender_id
      this.price = message.price
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
      this.sentAt = message.sent_at
      this.messageId = message.id
      this.reverted = message.reverted
      this.paidAt = message.paid_at
      this.paying = message.paying
      this.pending = message.pending
      this.previewIndex = message.preview_index
      this.contentProcessed = message.content_processed
      this.automatic = message.automatic
    }
    this.contents = contents
  }
}
