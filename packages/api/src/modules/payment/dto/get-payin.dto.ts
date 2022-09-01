import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

import { PayinDto } from './payin.dto'

export class GetPayinsRequestDto {
  @IsInt()
  @Min(0)
  @ApiProperty()
  offset: number

  @IsInt()
  @Min(1)
  @ApiProperty()
  limit: number
}

export class GetPayinsResponseDto {
  @ApiProperty()
  count: number

  @ApiProperty({ type: [PayinDto] })
  payins: Array<PayinDto>
}
