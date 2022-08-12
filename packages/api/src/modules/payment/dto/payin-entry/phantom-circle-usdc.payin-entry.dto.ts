import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class PhantomCircleUSDCEntryRequestDto extends PayinEntryRequestDto {
  // @ApiProperty()
  // ownerAccount: string
}

export class PhantomCircleUSDCEntryResponseDto extends PayinEntryResponseDto {
  // @ApiProperty()
  // message: Uint8Array

  @ApiProperty()
  tokenAddress: string

  @ApiProperty()
  depositAddress: string

  @ApiProperty()
  networkUrl: string
}
