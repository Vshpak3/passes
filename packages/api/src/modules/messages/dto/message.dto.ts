import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CHANNEL_ID_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

export class MessageDto {
  @IsUUID()
  @DtoProperty({ optional: true })
  messageId?: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  attachments: any[]

  @Length(1, CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @Min(0)
  @DtoProperty({ optional: true })
  tipAmount?: number

  @DtoProperty({ optional: true })
  created_at?: number

  constructor(message) {
    if (message) {
      this.text = message.text
      this.attachments = JSON.parse(message.attachments)
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
      this.created_at = message.created_at
      this.messageId = message.id
    }
  }
}
