import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassOrderTypeEnum } from '../enum/pass.order.enum'
import { PassDto } from './pass.dto'

export class GetPassRequestDto extends PickType(PassDto, ['passId']) {}

export class GetPassResponseDto extends PassDto {}

export class GetPassesRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'search',
  'pinned',
  'pinnedAt',
  'order',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string

  @DtoProperty({ custom_type: PassTypeEnum, optional: true })
  type?: PassTypeEnum

  @DtoProperty({ type: 'currency', optional: true })
  price?: number

  @DtoProperty({ custom_type: PassOrderTypeEnum })
  orderType: PassOrderTypeEnum
}
export class GetPassesResponseDto
  extends GetPassesRequestDto
  implements PageResponseDto<PassDto>
{
  @DtoProperty({ custom_type: [PassDto] })
  data: PassDto[]

  constructor(passes: PassDto[], requestDto: GetPassesRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = passes

    if (passes.length > 0) {
      this.lastId = passes[passes.length - 1].passId
      switch (this.orderType) {
        case PassOrderTypeEnum.CREATED_AT:
          this.createdAt = passes[passes.length - 1].createdAt
          break
        case PassOrderTypeEnum.PINNED_AT:
          this.pinnedAt = passes[passes.length - 1].pinnedAt
          break
        case PassOrderTypeEnum.PRICE:
          this.price = passes[passes.length - 1].price
      }
    }
  }
}

export class GetExternalPassesResponseDto extends GetPassesResponseDto {}
