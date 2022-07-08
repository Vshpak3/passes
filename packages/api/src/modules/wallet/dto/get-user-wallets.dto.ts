import { ApiProperty } from '@nestjs/swagger'

import { WalletEntity } from '../entities/wallet.entity'
import { Wallet } from './wallet.dto'

export class GetUserWalletsDto {
  @ApiProperty()
  wallets: Wallet[]

  constructor(wallets: WalletEntity[]) {
    this.wallets = wallets.map((w) => new Wallet(w))
  }
}
