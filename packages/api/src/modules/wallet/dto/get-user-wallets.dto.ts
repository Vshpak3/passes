import { ApiProperty } from '@nestjs/swagger'

import { WalletEntity } from '../entities/wallet.entity'
import { WalletDto } from './wallet.dto'

export class GetUserWalletsDto {
  @ApiProperty()
  wallets: WalletDto[]

  constructor(wallets: WalletEntity[]) {
    this.wallets = wallets.map((w) => new WalletDto(w))
  }
}
