import { IsEnum, IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PassDto } from './pass.dto'

export class PassHolderDto extends PassDto {
  @IsUUID()
  @DtoProperty()
  passHolderId: string

  @IsUUID()
  @DtoProperty({ optional: true })
  holderId?: string

  @IsUUID()
  @DtoProperty({ optional: true })
  walletId?: string

  @DtoProperty({ optional: true })
  messages?: number | null

  @DtoProperty({ optional: true })
  expiresAt?: Date

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  holderUsername?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  holderDisplayName?: string

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  address: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum

  @IsUUID()
  @DtoProperty({ optional: true })
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
