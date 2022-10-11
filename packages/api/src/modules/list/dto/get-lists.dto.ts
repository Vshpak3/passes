import { PickType } from '@nestjs/swagger'
import { Length } from 'class-validator'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { LIST_NAME_LENGTH } from '../constants/schema'
import { ListOrderTypeEnum } from '../enum/list.order.enum'
import { ListDto } from './list.dto'

export class GetListsRequestsDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'updatedAt',
  'order',
  'search',
]) {
  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  name?: string

  @DtoProperty({ custom_type: ListOrderTypeEnum })
  orderType: ListOrderTypeEnum
}

export class GetListsResponseDto
  extends GetListsRequestsDto
  implements PageResponseDto<ListDto>
{
  @DtoProperty({ custom_type: [ListDto] })
  data: ListDto[]

  constructor(lists: ListDto[], requestDto: GetListsRequestsDto) {
    super()
    this.lastId = undefined
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.data = lists

    if (lists.length > 0) {
      this.lastId = lists[lists.length - 1].listId
      switch (requestDto.orderType) {
        case ListOrderTypeEnum.CREATED_AT:
          this.createdAt = lists[lists.length - 1].createdAt
          break
        case ListOrderTypeEnum.UPDATED_AT:
          this.updatedAt = lists[lists.length - 1].updatedAt
          break
        case ListOrderTypeEnum.NAME:
          this.name = lists[lists.length - 1].name
          break
      }
    }
  }
}
