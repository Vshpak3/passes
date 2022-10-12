import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassDto } from './pass.dto'

export class GetPassResponseDto extends PassDto {}

export class GetPassesRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'search',
  'pinned',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string

  @DtoProperty({ custom_type: PassTypeEnum, optional: true })
  type?: PassTypeEnum
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
      this.createdAt = passes[passes.length - 1].createdAt
    }
  }
}

export class GetExternalPassesResponseDto extends GetPassesResponseDto {}
