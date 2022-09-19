import { IsEnum, IsUUID, Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { AdminDto } from './admin.dto'

export class ExternalPassAddressRequestDto extends AdminDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty()
  address: string

  @IsUUID()
  @DtoProperty()
  passId: string

  @IsEnum(ChainEnum)
  @DtoProperty({ enum: ChainEnum })
  chain: ChainEnum
}
