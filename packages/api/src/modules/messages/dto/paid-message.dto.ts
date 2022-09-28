import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { CONTENT_IDS_LENGTH, MESSAGE_LENGTH } from '../constants/schema'

export class PaidMessageDto {
  @DtoProperty({ type: 'uuid' })
  paidMessageId: string

  @DtoProperty({ type: 'uuid' })
  creatorId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  text: string

  @Min(0)
  @DtoProperty({ type: 'number' })
  price: number

  @Length(1, CONTENT_IDS_LENGTH)
  @DtoProperty({ type: 'uuid[]' })
  contentIds: string

  @Min(0)
  @DtoProperty({ type: 'number' })
  numPurchases: number

  @Min(0)
  @DtoProperty({ type: 'number' })
  earningsPurchases: number
}
