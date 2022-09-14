import { PickType } from '@nestjs/swagger'
import { IsEnum, Length } from 'class-validator'

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
  @DtoProperty({ optional: true })
  name?: string

  @IsEnum(ListOrderTypeEnum)
  @DtoProperty({ enum: ListOrderTypeEnum })
  orderType: ListOrderTypeEnum
}

export class GetListsResponseDto extends PageResponseDto {
  @DtoProperty()
  lists: ListDto[]

  @Length(1, LIST_NAME_LENGTH)
  @DtoProperty({ optional: true })
  name?: string

  constructor(lists: ListDto[], orderType: ListOrderTypeEnum) {
    super()
    this.lists = lists

    if (lists.length > 0) {
      this.lastId = lists[lists.length - 1].listId
      switch (orderType) {
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
