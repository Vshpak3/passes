import { Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_SYMBOL_LENGTH,
  PASS_TITLE_LENGTH,
} from '../constants/schema'
import { PassEntity } from '../entities/pass.entity'
import { AccessTypeEnum } from '../enum/access.enum'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassAnimationEnum } from '../enum/pass-animation.enum'
import { PassImageEnum } from '../enum/pass-image.enum'
export class PassDto {
  @DtoProperty({ type: 'uuid' })
  passId: string

  @DtoProperty({ type: 'uuid', nullable: true, optional: true })
  creatorId?: string | null

  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty({ type: 'string' })
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string' })
  description: string

  @Length(1, PASS_SYMBOL_LENGTH)
  @DtoProperty({ type: 'string' })
  symbol: string

  @DtoProperty({ custom_type: PassTypeEnum })
  type: PassTypeEnum

  @Min(0)
  @DtoProperty({ type: 'currency' })
  price: number

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true })
  ethPrice: number | null

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true, optional: true })
  duration?: number | null

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true })
  totalSupply: number | null

  @Min(0)
  @DtoProperty({ type: 'number', nullable: true })
  remainingSupply: number | null

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ type: 'boolean' })
  freetrial: boolean

  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string', nullable: true })
  collectionAddress: string | null

  @DtoProperty({ type: 'date', nullable: true, optional: true })
  pinnedAt: Date | null

  @DtoProperty({ type: 'date' })
  createdAt: Date

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  creatorUsername?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ type: 'string', optional: true })
  creatorDisplayName?: string

  @DtoProperty({ custom_type: PassImageEnum })
  imageType: PassImageEnum

  @DtoProperty({ custom_type: PassAnimationEnum, nullable: true })
  animationType: PassAnimationEnum | null

  @DtoProperty({ custom_type: AccessTypeEnum })
  accessType: AccessTypeEnum

  @DtoProperty({ type: 'number', nullable: true })
  totalMessages: number | null

  constructor(
    pass:
      | (PassEntity & {
          creator_username?: string
          creator_display_name?: string
        })
      | undefined,
  ) {
    if (pass) {
      this.passId = pass.id
      this.creatorId = pass.creator_id
      this.title = pass.title
      this.description = pass.description
      this.symbol = pass.symbol
      this.type = pass.type
      this.duration = pass.duration
      this.totalSupply = pass.total_supply
      this.remainingSupply = pass.remaining_supply
      this.freetrial = pass.freetrial
      this.pinnedAt = pass.pinned_at
      this.price = pass.price
      this.totalSupply = pass.total_supply
      this.createdAt = pass.created_at
      this.chain = pass.chain
      this.collectionAddress = pass.collection_address
      this.ethPrice = pass.eth_price
      this.imageType = pass.image_type
      this.animationType = pass.animation_type
      this.accessType = pass.access_type
      this.totalMessages = pass.messages

      this.creatorUsername = pass.creator_username
      this.creatorDisplayName = pass.creator_display_name
    }
  }
}
