import { PickType } from '@nestjs/swagger'

import { PageRequestDto, PageResponseDto } from '../../../util/dto/page.dto'
import { DtoProperty } from '../../../web/dto.web'
import { PayoutDto } from './payout.dto'
export class GetPayoutsRequestDto extends PickType(PageRequestDto, [
  'lastId',
  'createdAt',
]) {
  @DtoProperty({ type: 'date', optional: true })
  startDate?: Date

  @DtoProperty({ type: 'date', optional: true })
  endDate?: Date
}

export class GetPayoutsResponseDto
  extends GetPayoutsRequestDto
  implements PageResponseDto<PayoutDto>
{
  @DtoProperty({ custom_type: [PayoutDto] })
  data: PayoutDto[]

  constructor(payins: PayoutDto[], requestDto: GetPayoutsRequestDto) {
    super()
    for (const key in requestDto) {
      this[key] = requestDto[key]
    }
    this.lastId = undefined
    this.data = payins
    if (payins.length > 0) {
      this.lastId = payins[payins.length - 1].payoutId
      this.createdAt = payins[payins.length - 1].createdAt
    }
  }
}
