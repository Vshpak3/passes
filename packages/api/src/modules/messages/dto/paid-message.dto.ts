import { IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { MESSAGE_LENGTH } from '../constants/schema'

export class PaidMessageDto {
  @IsUUID()
  @DtoProperty()
  paidMessageId: string

  @IsUUID()
  @DtoProperty()
  creatorId: string

  @Length(1, MESSAGE_LENGTH)
  @DtoProperty({ optional: true })
  price?: number
}
