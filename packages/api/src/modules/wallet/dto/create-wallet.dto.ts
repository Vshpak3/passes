import { ApiProperty } from '@nestjs/swagger'

import { Chain } from '../enum/chain.enum'

export class CreateWalletDto {
  @ApiProperty()
  signedMessage: string

  @ApiProperty()
  rawMessage: string

  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: Chain
}
