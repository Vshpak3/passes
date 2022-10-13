import { Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import {
  PASS_DESCRIPTION_LENGTH,
  PASS_MAX_ROYALTIES,
  PASS_MIN_ROYALTIES,
  PASS_TITLE_LENGTH,
} from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'
import { PassAnimationEnum } from '../enum/pass-animation.enum'
import { PassImageEnum } from '../enum/pass-image.enum'

export class CreatePassRequestDto {
  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty({ type: 'string' })
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty({ type: 'string' })
  description: string

  @DtoProperty({ custom_type: PassTypeEnum })
  type: PassTypeEnum

  @Min(0)
  @DtoProperty({ type: 'currency' })
  price: number

  @Min(1)
  @DtoProperty({ type: 'number', nullable: true })
  totalSupply: number | null

  @Min(1)
  @DtoProperty({ type: 'number', optional: true })
  duration?: number

  @DtoProperty({ type: 'boolean', optional: true })
  freetrial?: boolean

  @DtoProperty({ type: 'number', optional: true })
  messages?: number | null

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @Min(PASS_MIN_ROYALTIES)
  @Max(PASS_MAX_ROYALTIES)
  @DtoProperty({ type: 'number' })
  royalties: number

  @DtoProperty({
    custom_type: PassAnimationEnum,
    optional: true,
    nullable: true,
  })
  animationType?: PassAnimationEnum | null

  @DtoProperty({ custom_type: PassImageEnum })
  imageType: PassImageEnum
}

export class CreatePassResponseDto {
  @DtoProperty({ type: 'uuid' })
  passId: string

  constructor(passId: string) {
    this.passId = passId
  }
}
