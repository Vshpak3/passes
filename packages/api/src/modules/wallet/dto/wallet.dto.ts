import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class WalletDto {
  @DtoProperty()
  walletId: string

  @DtoProperty({ required: false })
  userId?: string

  @DtoProperty()
  address: string

  @DtoProperty()
  chain: ChainEnum

  @DtoProperty()
  custodial: boolean

  @DtoProperty()
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
