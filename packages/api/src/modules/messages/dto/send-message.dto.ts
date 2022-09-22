import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { CHANNEL_ID_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

export class SendMessageRequestDto {
  @Length(1, MESSAGE_LENGTH)
  @DtoProperty()
  text: string

  @DtoProperty()
  attachments: any[]

  @Length(1, CHANNEL_ID_LENGTH)
  @DtoProperty()
  channelId: string

  @IsUUID()
  @DtoProperty()
  otherUserId: string

  @Min(0)
  @DtoProperty()
  tipAmount: number

  @DtoProperty({ optional: true })
  payinMethod?: PayinMethodDto
}
