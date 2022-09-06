import { DtoProperty } from '../../../web/dto.web'
import { MessageDto } from './message.dto'

export class GetMessagesResponseDto {
  @DtoProperty({ type: [MessageDto] })
  messages: MessageDto[]

  constructor(messages: MessageDto[]) {
    this.messages = messages
  }
}
