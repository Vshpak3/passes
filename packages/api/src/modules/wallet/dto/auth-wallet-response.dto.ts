import { ApiProperty } from '@nestjs/swagger'

import { ChainEnum } from '../enum/chain.enum'

export class AuthWalletResponseDto {
  @ApiProperty()
  rawMessage: string

  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}
