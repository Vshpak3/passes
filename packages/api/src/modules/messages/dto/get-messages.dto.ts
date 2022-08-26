import { ApiProperty } from '@nestjs/swagger'

import { MessageDto } from './message.dto'

export class GetMessagesResponseDto {
  @ApiProperty({ type: [MessageDto] })
  messages: MessageDto[]

  constructor(messages: MessageDto[]) {
    this.messages = messages
  }
}
