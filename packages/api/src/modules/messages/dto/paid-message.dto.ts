import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { MESSAGE_LENGTH } from '../constants/schema'

export class PaidMessageDto {
  @DtoProperty({ type: 'uuid' })
  paidMessageId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ type: 'number', optional: true })
  price?: number
}
