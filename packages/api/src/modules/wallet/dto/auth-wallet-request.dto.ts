import { ApiProperty } from '@nestjs/swagger'

import { Chain } from '../enum/chain.enum'

export class AuthWalletRequestDto {
  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: Chain
}
