import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PassDto } from './pass.dto'

export class PassHolderDto extends PassDto {
  @DtoProperty({ type: 'uuid' })
  passHolderId: string

  @DtoProperty({ type: 'uuid', optional: true })
  holderId?: string

  @DtoProperty({ type: 'uuid', optional: true })
  walletId?: string

  @DtoProperty({ type: 'number', optional: true })
  messages?: number | null

  @DtoProperty({ type: 'date', optional: true })
  expiresAt?: Date

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  holderUsername?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  holderDisplayName?: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  address: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ type: 'uuid', optional: true })
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
