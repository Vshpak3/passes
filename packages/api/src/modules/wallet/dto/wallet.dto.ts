import { IsEnum, IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../constants/schema'
import { ChainEnum } from '../enum/chain.enum'

export class WalletDto {
  @IsUUID()
  @DtoProperty()
  walletId: string

  @IsUUID()
  @DtoProperty({ required: false })
  userId?: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  address: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
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
