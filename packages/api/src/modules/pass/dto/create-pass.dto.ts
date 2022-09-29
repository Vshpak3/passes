import { Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PASS_DESCRIPTION_LENGTH, PASS_TITLE_LENGTH } from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'

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
  @DtoProperty({ type: 'number' })
  totalSupply: number

  @Min(1)
  @DtoProperty({ type: 'number', optional: true })
  duration?: number

  @DtoProperty({ type: 'boolean', optional: true })
  freetrial: boolean

  @DtoProperty({ type: 'number', optional: true })
  messages?: number | null

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @Min(500)
  @Max(3000)
  @DtoProperty({ type: 'number' })
  royalties: number
}

export class CreatePassResponseDto {
  @DtoProperty({ type: 'uuid' })
  passId: string

  constructor(passId: string) {
    this.passId = passId
  }
}
