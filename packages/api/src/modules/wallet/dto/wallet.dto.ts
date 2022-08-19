import { ApiProperty } from '@nestjs/swagger'

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

  @ApiProperty()
  authenticated: boolean

  constructor(wallet) {
    if (wallet) {
      this.id = wallet.id
      this.userId = wallet.user?.id
      this.address = wallet.address
      this.chain = wallet.chain
      this.custodial = wallet.custodial
      this.authenticated = wallet.authenticated
    }
  }
}
