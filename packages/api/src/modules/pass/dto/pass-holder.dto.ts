import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PassEntity } from '../entities/pass.entity'
import { PassHolderEntity } from '../entities/pass-holder.entity'
import { PassDto } from './pass.dto'

export class PassHolderDto extends PassDto {
  @DtoProperty({ type: 'uuid' })
  passHolderId: string

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  holderId?: string | null

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  walletId?: string | null

  @DtoProperty({ type: 'number', nullable: true, optional: true })
  messages?: number | null

  @DtoProperty({ type: 'date', nullable: true, optional: true })
  expiresAt?: Date | null

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

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  tokenId?: string | null

  constructor(
    passHolder:
      | (PassHolderEntity &
          PassEntity & {
            holder_username?: string
            holder_display_name?: string
          })
      | undefined,
  ) {
    super(passHolder)
    if (passHolder) {
      this.passHolderId = passHolder.id
      this.holderId = passHolder.holder_id
      this.walletId = passHolder.wallet_id
      this.expiresAt = passHolder.expires_at
      this.messages = passHolder.messages
      this.tokenId = passHolder.token_id

      this.holderUsername = passHolder.holder_username
      this.holderDisplayName = passHolder.holder_display_name
    }
  }
}
