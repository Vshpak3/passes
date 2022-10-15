import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PayinMethodDto } from '../../payment/dto/payin-method.dto'
import { MESSAGE_LENGTH } from '../constants/schema'

export class SendMessageRequestDto {
  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ type: 'string' })
  text: string

  @DtoProperty({ type: 'uuid[]' })
  contentIds: string[]

  @DtoProperty({ type: 'number' })
  previewIndex: number

  @DtoProperty({ type: 'uuid' })
  channelId: string

  @Min(0)
  @DtoProperty({ type: 'currency' })
  tipAmount: number

  @Min(0)
  @DtoProperty({ type: 'currency', optional: true })
  price?: number

  @DtoProperty({ custom_type: PayinMethodDto, optional: true })
  payinMethod?: PayinMethodDto

  @DtoProperty({ type: 'date', optional: true })
  scheduledAt?: Date
}
