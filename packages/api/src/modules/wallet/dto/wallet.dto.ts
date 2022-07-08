import { ApiProperty } from '@nestjs/swagger'

import { WalletEntity } from '../entities/wallet.entity'
import { Chain } from '../enum/chain.enum'

export class Wallet {
  @ApiProperty()
  userId: string

  @ApiProperty()
  address: string

  @ApiProperty()
  chain: Chain

  constructor(walletEntity: WalletEntity) {
    this.userId = walletEntity.user.id
    this.address = walletEntity.address
    this.chain = walletEntity.chain
  }
}
