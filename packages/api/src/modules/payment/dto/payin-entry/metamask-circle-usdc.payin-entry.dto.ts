import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleUSDCEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  depositAddress: string

  @ApiProperty()
  chainId: number
}
