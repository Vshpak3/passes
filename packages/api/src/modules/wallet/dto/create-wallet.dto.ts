import { ApiProperty } from '@nestjs/swagger'

import { ChainEnum } from '../enum/chain.enum'

export class CreateWalletDto {
  @ApiProperty()
  signedMessage: string

  @ApiProperty()
  rawMessage: string

  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}

export class CreateUnauthenticatedWalletDto {
  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}
