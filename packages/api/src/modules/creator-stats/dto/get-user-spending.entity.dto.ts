import { DtoProperty } from '../../../web/dto.web'

export class GetUserSpendingRequestDto {
  @DtoProperty({ type: 'uuid' })
  userId: string
}

export class GetUserSpendingResponseDto {
  @DtoProperty({ type: 'number' })
  amount: number
}
