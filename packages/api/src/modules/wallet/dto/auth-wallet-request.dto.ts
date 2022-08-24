import { ApiProperty } from '@nestjs/swagger'

import { ChainEnum } from '../enum/chain.enum'

export class AuthWalletRequestDto {
  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}
