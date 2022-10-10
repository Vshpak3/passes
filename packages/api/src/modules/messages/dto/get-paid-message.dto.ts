import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PaidMessageDto } from './paid-message.dto'

export class GetPaidMessagesRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {}

export class GetPaidMessagesResponseDto
  extends GetPaidMessagesRequestDto
  implements PageResponseDto<PaidMessageDto>
{
  @DtoProperty({ custom_type: [PaidMessageDto] })
  data: PaidMessageDto[]

  constructor(
    paidMessages: PaidMessageDto[],
    requestDto: GetPaidMessagesRequestDto,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = paidMessages

    if (paidMessages.length > 0) {
      this.lastId = paidMessages[paidMessages.length - 1].paidMessageId
      this.createdAt = paidMessages[paidMessages.length - 1].createdAt
    }
  }
}
