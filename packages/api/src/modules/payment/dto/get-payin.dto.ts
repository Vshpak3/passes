import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PayinDto } from './payin.dto'

export class GetPayinsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ type: 'date', optional: true })
  startDate?: Date

  @DtoProperty({ type: 'date', optional: true })
  endDate?: Date

  @DtoProperty({ type: 'boolean', optional: true })
  inProgress?: boolean
}

export class GetPayinsResponseDto
  extends GetPayinsRequestDto
  implements PageResponseDto<PayinDto>
{
  @DtoProperty({ custom_type: [PayinDto] })
  data: PayinDto[]

  constructor(payins: PayinDto[], requestDto: GetPayinsRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = payins
    if (payins.length > 0) {
      this.lastId = payins[payins.length - 1].payinId
      this.createdAt = payins[payins.length - 1].createdAt
    }
  }
}
