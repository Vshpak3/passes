import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MessageDto {
  @ApiPropertyOptional()
  id?: string

  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @ApiProperty()
  channelId: string

  @ApiPropertyOptional()
  tipAmount?: number

  @ApiPropertyOptional()
  created_at?: number

  constructor(message) {
    if (message) {
      this.id = message.id
      this.text = message.test
      this.attachments = JSON.parse(message.attachments)
      this.channelId = message.channel_id
      this.tipAmount = message.tip_amount
    }
  }
}
