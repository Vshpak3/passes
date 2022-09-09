import { DtoProperty } from '../../../web/dto.web'

export class GetFreeMesssagesResponseDto {
  @DtoProperty()
  messages: number | null

  constructor(messages: number | null) {
    this.messages = messages
  }
}
