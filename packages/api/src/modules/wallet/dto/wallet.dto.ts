import { ApiProperty } from '@nestjs/swagger'

import { WalletEntity } from '../entities/wallet.entity'
import { Chain } from '../enum/chain.enum'

export class WalletDto {
  @ApiProperty()
  userId?: string

  @ApiProperty()
  address: string

  @ApiProperty()
  chain: Chain

  @ApiProperty()
  custodial: boolean

  constructor(walletEntity: WalletEntity) {
    this.userId = walletEntity.user?.id
    this.address = walletEntity.address
    this.chain = walletEntity.chain
    this.custodial = walletEntity.custodial
  }
}
