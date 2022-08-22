import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MessageDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @ApiProperty()
  channelId: string

  @ApiPropertyOptional()
  tipAmount?: number

  constructor(message) {
    if (message) {
      this.text = message.test
      this.attachments = JSON.parse(message.attachments)
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
    }
  }
}
