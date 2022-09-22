import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ContentDto } from '../../content/dto/content.dto'
import { MESSAGE_LENGTH } from '../constants/schema'

export class MessageDto {
  @IsUUID()
  @DtoProperty()
  messageId: string

  @IsUUID()
  @DtoProperty()
  senderId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  contents: ContentDto[]

  @IsUUID()
  @DtoProperty()
  channelId: string

  @Min(0)
  @DtoProperty({ optional: true })
  tipAmount?: number

  @DtoProperty()
  paid: boolean

  @DtoProperty()
  pending: boolean

  @DtoProperty()
  reverted: boolean

  @DtoProperty()
  created_at: number

  constructor(message) {
    if (message) {
      this.text = message.text
      this.senderId = message.senderId
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
      this.created_at = message.created_at
      this.messageId = message.id
      this.reverted = message.reverted
    }
  }
}
