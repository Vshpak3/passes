import { Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetFreeMesssagesResponseDto {
  @Min(0)
  @DtoProperty({ type: 'number' })
  messages: number | null

  constructor(messages: number | null) {
    this.messages = messages
  }
}
