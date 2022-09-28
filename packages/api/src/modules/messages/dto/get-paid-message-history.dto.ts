import { DtoProperty } from '../../../web/dto.web'
import { PaidMessageHistoryDto } from './paid-message-history.dto'

export class GetPaidMessageHistoryRequestDto {
  @DtoProperty({ type: 'uuid' })
  paidMessageId: string

  @DtoProperty({ type: 'date' })
  start: Date

  @DtoProperty({ type: 'date' })
  end: Date
}

export class GetPaidMessageHistoryResponseDto {
  @DtoProperty({ custom_type: [PaidMessageHistoryDto] })
  paidMessageHistories: PaidMessageHistoryDto[]

  constructor(paidMessageHistories: PaidMessageHistoryDto[]) {
    this.paidMessageHistories = paidMessageHistories
  }
}
