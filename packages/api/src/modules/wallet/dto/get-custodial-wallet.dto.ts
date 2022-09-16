import { IsEnum } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class GetCustodialWalletRequestDto {
  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum
}
