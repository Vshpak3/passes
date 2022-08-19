import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class PhantomCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class PhantomCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  depositAddress: string

  @ApiProperty()
  networkUrl: string
}
