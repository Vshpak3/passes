import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PassDto } from './pass.dto'

export class PassHolderDto extends PassDto {
  @DtoProperty()
  passHolderId: string

  @DtoProperty({ required: false })
  holderId?: string

  @DtoProperty({ required: false })
  walletId?: string

  @DtoProperty({ required: false })
  messages?: number | null

  @DtoProperty({ required: false })
  expiresAt?: Date

  @DtoProperty({ required: false })
  holderUsername?: string

  @DtoProperty({ required: false })
  holderDisplayName?: string

  @DtoProperty()
  address: string

  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ required: false })
  tokenId?: string

  constructor(passHolder) {
    super(passHolder)
    if (passHolder) {
      this.passHolderId = passHolder.id
      this.holderId = passHolder.holder_id
      this.walletId = passHolder.wallet_id
      this.expiresAt = passHolder.expires_at
      this.messages = passHolder.messages

      this.holderUsername = passHolder.holder_username
      this.holderDisplayName = passHolder.holder_display_name
    }
  }
}
