import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class MessageDto {
  @IsUUID()
  @DtoProperty({ required: false })
  id?: string

  @DtoProperty()
  text: string

  @DtoProperty()
  attachments: any[]

  @DtoProperty()
  channelId: string

  @DtoProperty({ required: false })
  tipAmount?: number

  @DtoProperty({ required: false })
  created_at?: number

  constructor(
    text: string,
    attachments: any[],
    channelId: string,
    tipAmount?: number,
    created_at?: number,
    id?: string,
  ) {
    this.text = text
    this.attachments = attachments
    this.channelId = channelId
    this.tipAmount = tipAmount
    this.created_at = created_at
    this.id = id
  }
}
