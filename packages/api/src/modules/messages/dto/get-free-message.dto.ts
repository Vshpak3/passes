import { IsInt, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'

export class GetFreeMesssagesResponseDto {
  @IsInt()
  @Min(0)
  @DtoProperty()
  messages: number | null

  constructor(messages: number | null) {
    this.messages = messages
  }
}
