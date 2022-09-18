import { IsEnum, IsInt, IsUUID, Length, Max, Min } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { PASS_DESCRIPTION_LENGTH, PASS_TITLE_LENGTH } from '../constants/schema'
import { PassTypeEnum } from '../enum/pass.enum'

export class CreatePassRequestDto {
  @Length(1, PASS_TITLE_LENGTH)
  @DtoProperty()
  title: string

  @Length(1, PASS_DESCRIPTION_LENGTH)
  @DtoProperty()
  description: string

  @DtoProperty()
  type: PassTypeEnum

  @IsInt()
  @Min(0)
  @DtoProperty()
  price: number

  @DtoProperty()
  @IsInt()
  @Min(1)
  totalSupply: number

  @IsInt()
  @Min(1)
  @DtoProperty({ optional: true })
  duration?: number

  @DtoProperty({ optional: true })
  freetrial: boolean

  @DtoProperty({ optional: true })
  messages?: number | null

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum

  @Min(0)
  @Max(10000)
  @DtoProperty()
  royalties: number
}

export class CreatePassResponseDto {
  @IsUUID()
  @DtoProperty()
  passId: string

  constructor(passId: string) {
    this.passId = passId
  }
}
