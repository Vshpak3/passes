import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

export class WalletDto {
  @DtoProperty({ type: 'uuid' })
  walletId: string

  @DtoProperty({ type: 'uuid', optional: true })
  userId?: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  address: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ type: 'boolean' })
  custodial: boolean

  @DtoProperty({ type: 'boolean' })
  authenticated: boolean

  constructor(wallet) {
    if (wallet) {
      this.walletId = wallet.id
      this.userId = wallet.user_id
      this.address = wallet.address
      this.chain = wallet.chain
      this.custodial = wallet.custodial
      this.authenticated = wallet.authenticated
    }
  }
}
