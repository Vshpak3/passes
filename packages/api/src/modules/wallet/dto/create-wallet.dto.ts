import { ApiProperty } from '@nestjs/swagger'

import { ChainEnum } from '../enum/chain.enum'

export class CreateWalletRequestDto {
  @ApiProperty()
  signedMessage: string

  @ApiProperty()
  rawMessage: string

  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}

export class CreateUnauthenticatedWalletRequestDto {
  @ApiProperty()
  walletAddress: string

  @ApiProperty()
  chain: ChainEnum
}
