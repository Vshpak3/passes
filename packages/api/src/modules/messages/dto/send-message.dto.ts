import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'

export class SendMessageRequestDto {
  @DtoProperty()
  text: string

  @DtoProperty()
  attachments: any[]

  @DtoProperty()
  channelId: string

  @DtoProperty()
  @Min(0)
  tipAmount: number

  @DtoProperty({ required: false })
  payinMethod?: PayinMethodDto
}
