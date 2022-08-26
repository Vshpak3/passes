import { ApiProperty } from '@nestjs/swagger'

import { WalletDto } from './wallet.dto'

export class GetWalletResponseDto extends WalletDto {}

export class GetWalletsResponseDto {
  @ApiProperty({ type: [WalletDto] })
  wallets: WalletDto[]

  constructor(wallets: WalletDto[]) {
    this.wallets = wallets
  }
}
