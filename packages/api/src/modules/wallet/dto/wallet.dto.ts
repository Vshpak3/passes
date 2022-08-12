import { ApiProperty } from '@nestjs/swagger'

import { WalletEntity } from '../entities/wallet.entity'
import { Chain } from '../enum/chain.enum'

export class WalletDto {
  @ApiProperty()
  id?: string

  @ApiProperty()
  userId?: string

  @ApiProperty()
  address: string

  @ApiProperty()
  chain: Chain

  @ApiProperty()
  custodial: boolean

  constructor(walletEntity: WalletEntity) {
    this.id = walletEntity.id
    this.userId = walletEntity.user?.id
    this.address = walletEntity.address
    this.chain = walletEntity.chain
    this.custodial = walletEntity.custodial
  }
}
