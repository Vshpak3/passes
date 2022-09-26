import { IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { PaidMessageHistoryDto } from './paid-message-history.dto'

export class GetPaidMessageHistoryRequestDto {
  @IsUUID()
  @DtoProperty()
  paidMessageId: string

  @DtoProperty()
  start: Date

  @DtoProperty()
  end: Date
}

export class GetPaidMessageHistoryResponseDto {
  @DtoProperty()
  paidMessageHistories: PaidMessageHistoryDto[]

  constructor(paidMessageHistories) {
    this.paidMessageHistories = paidMessageHistories
  }
}
