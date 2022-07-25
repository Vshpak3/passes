import { ApiProperty } from '@nestjs/swagger'

export class SendMessageDto {
  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @ApiProperty()
  channelId: string

  @ApiProperty()
  tipAmount: number
}
