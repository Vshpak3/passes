import { IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MESSAGE_LENGTH } from '../constants/schema'

export class SendMessageRequestDto {
  @Length(1, MESSAGE_LENGTH)
  @DtoProperty()
  text: string

  @IsUUID('all', { each: true })
  @DtoProperty()
  contentIds: string[]

  @IsUUID()
  @DtoProperty()
  channelId: string

  @Min(0)
  @DtoProperty()
  tipAmount: number

  @Min(0)
  @DtoProperty({ optional: true })
  price?: number

  @DtoProperty({ optional: true })
  payinMethod?: PayinMethodDto
}
