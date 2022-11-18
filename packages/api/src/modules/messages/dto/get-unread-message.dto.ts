import { DtoProperty } from '../../../web/dto.web'

export class UnreadMessagesResponseDto {
  @DtoProperty({ type: 'number' })
  count: number

  constructor(count: number) {
    this.count = count
  }
}
