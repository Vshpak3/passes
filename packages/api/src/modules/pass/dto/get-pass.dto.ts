import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PassDto } from './pass.dto'

export class GetPassResponseDto extends PassDto {}

export class GetPassesRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'search',
]) {}

export class GetCreatorPassesRequestDto extends GetPassesRequestDto {
  @DtoProperty({ type: 'uuid' })
  creatorId: string
}

export class GetExternalPassesRequestDto extends GetPassesRequestDto {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string
}

export class GetPassesResponseDto extends PageResponseDto {
  @DtoProperty({ custom_type: [PassDto] })
  passes: PassDto[]

  constructor(passes: PassDto[]) {
    super()
    this.passes = passes

    if (passes.length > 0) {
      this.lastId = passes[passes.length - 1].passId
      this.createdAt = passes[passes.length - 1].createdAt
    }
  }
}
