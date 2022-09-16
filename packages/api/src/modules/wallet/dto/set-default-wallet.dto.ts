import { IsEnum, IsUUID } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class SetDefaultWalletRequestDto {
  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum

  @IsUUID()
  @DtoProperty()
  walletId: string
}
