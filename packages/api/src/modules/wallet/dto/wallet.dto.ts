import { ApiProperty } from '@nestjs/swagger'

import { ChainEnum } from '../enum/chain.enum'

export class WalletDto {
  @ApiProperty()
  id?: string

  @ApiProperty()
  userId?: string

  @ApiProperty()
  address: string

  @ApiProperty()
  chain: ChainEnum

  @ApiProperty()
  custodial: boolean

  @ApiProperty()
  authenticated: boolean

  constructor(wallet) {
    if (wallet) {
      this.id = wallet.id
      this.userId = wallet.user_id
      this.address = wallet.address
      this.chain = wallet.chain
      this.custodial = wallet.custodial
      this.authenticated = wallet.authenticated
    }
  }
}
