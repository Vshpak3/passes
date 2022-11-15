import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { UserDto } from '../../user/dto/user.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { MessageEntity } from '../entities/message.entity'

export class MessageBuyerDto extends PickType(UserDto, [
  'userId',
  'username',
  'displayName',
]) {
  @DtoProperty({ type: 'uuid' })
  messageId: string

  @DtoProperty({ type: 'date', nullable: true })
  paidAt: Date | null

  constructor(
    messageBuyer: MessageEntity & UserEntity & { receiver_id: string },
  ) {
    super()
    if (messageBuyer) {
      this.messageId = messageBuyer.id
      this.paidAt = messageBuyer.paid_at
      this.userId = messageBuyer.receiver_id
      this.username = messageBuyer.username
      this.displayName = messageBuyer.display_name
    }
  }
}

export class GetMessageBuyersRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'search',
]) {
  @DtoProperty({ type: 'uuid' })
  paidMessageId: string

  @DtoProperty({ type: 'date', optional: true })
  paidAt?: Date
}

export class GetMessageBuyersResponseDto
  extends GetMessageBuyersRequestDto
  implements PageResponseDto<MessageBuyerDto>
{
  @DtoProperty({ custom_type: [MessageBuyerDto] })
  data: MessageBuyerDto[]

  constructor(
    postBuyers: MessageBuyerDto[],
    requestDto: Partial<GetMessageBuyersRequestDto>,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = postBuyers

    if (postBuyers.length > 0) {
      this.lastId = postBuyers[postBuyers.length - 1].messageId
      this.paidAt = postBuyers[postBuyers.length - 1].paidAt ?? undefined
    }
  }
}
