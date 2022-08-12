import { ApiProperty } from '@nestjs/swagger'

import { PayinDto } from './payin.dto'

export class PayinListRequestDto {
  @ApiProperty()
  offset: number

  @ApiProperty()
  limit: number
}

export class PayinListResponseDto {
  @ApiProperty()
  count: number

  @ApiProperty({ type: [PayinDto] })
  payins: Array<PayinDto>
}
