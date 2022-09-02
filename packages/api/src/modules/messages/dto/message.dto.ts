import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class MessageDto {
  @IsUUID()
  @ApiPropertyOptional()
  id?: string

  @ApiProperty()
  text: string

  @ApiProperty()
  attachments: any[]

  @ApiProperty()
  content: string[]

  @ApiProperty()
  channelId: string

  @ApiPropertyOptional()
  tipAmount?: number

  @ApiPropertyOptional()
  created_at?: number

  constructor(
    text: string,
    attachments: any[],
    channelId: string,
    content: string[],
    tipAmount?: number,
    created_at?: number,
    id?: string,
  ) {
    this.text = text
    this.attachments = attachments
    this.content = content
    this.channelId = channelId
    this.tipAmount = tipAmount
    this.created_at = created_at
    this.id = id
  }
}
