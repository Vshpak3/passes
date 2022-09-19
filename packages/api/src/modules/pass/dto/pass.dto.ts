import { IsEnum, IsInt, IsUUID, Length, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import {
  USER_DISPLAY_NAME_LENGTH,
  USER_USERNAME_LENGTH,
} from '../../user/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_SYMBOL_LENGTH,
  PASS_TITLE_LENGTH,
} from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'
export class PassDto {
  @IsUUID()
  @DtoProperty()
  passId: string

  @IsUUID()
  @DtoProperty({ optional: true })
  creatorId?: string

  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty()
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty()
  description: string

  @Length(1, PASS_SYMBOL_LENGTH)
  @DtoProperty()
  symbol: string

  @IsEnum(PassTypeEnum)
  @DtoProperty({ enum: PassTypeEnum })
  type: PassTypeEnum

  @Min(0)
  @DtoProperty()
  price: number

  @IsInt()
  @Min(0)
  @DtoProperty({ optional: true })
  duration?: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  totalSupply: number

  @IsInt()
  @Min(0)
  @DtoProperty()
  remainingSupply: number

  @IsEnum(ChainEnum)
  chain: ChainEnum

  @DtoProperty()
  freetrial: boolean

  @DtoProperty({ optional: true })
  pinnedAt?: Date

  @DtoProperty({ optional: true })
  createdAt?: Date

  @Length(1, USER_USERNAME_LENGTH)
  @DtoProperty({ optional: true })
  creatorUsername?: string

  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  creatorDisplayName?: string

  constructor(pass) {
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

    this.creatorUsername = pass.creator_username
    this.creatorDisplayName = pass.creator_display_name
  }
}
