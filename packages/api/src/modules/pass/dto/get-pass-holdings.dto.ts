import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassHolderDto } from './pass-holder.dto'

export class GetPassHoldingsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
  'order',
  'search',
]) {
  @DtoProperty({ type: 'uuid', optional: true })
  creatorId?: string

  @DtoProperty({ type: 'uuid', optional: true })
  passId?: string

  @DtoProperty({ custom_type: PassTypeEnum, optional: true })
  passType?: PassTypeEnum

  @DtoProperty({ type: 'boolean', optional: true })
  expired?: boolean
}

export class GetPassHoldingResponseDto extends PassHolderDto {}

export class GetPassHoldingsResponseDto
  extends GetPassHoldingsRequestDto
  implements PageResponseDto<PassHolderDto>
{
  @DtoProperty({ custom_type: [PassHolderDto] })
  data: PassHolderDto[]

  constructor(
    passHolders: PassHolderDto[],
    requestDto: GetPassHoldingsRequestDto,
  ) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = passHolders
    if (passHolders.length > 0) {
      this.lastId = passHolders[passHolders.length - 1].passHolderId
      this.createdAt = passHolders[passHolders.length - 1].createdAt
    }
  }
}
