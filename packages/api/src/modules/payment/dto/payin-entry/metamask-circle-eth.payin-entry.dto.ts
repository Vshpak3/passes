import { ApiProperty } from '@nestjs/swagger'

import { PayinEntryRequestDto, PayinEntryResponseDto } from './payin-entry.dto'

export class MetamaskCircleETHEntryRequestDto extends PayinEntryRequestDto {}

export class MetamaskCircleETHEntryResponseDto extends PayinEntryResponseDto {
  @ApiProperty()
  depositAddress: string

  @ApiProperty()
  chainId: number
}
