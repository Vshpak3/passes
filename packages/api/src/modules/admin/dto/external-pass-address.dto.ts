import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { BLOCKCHAIN_ADDRESS_LENGTH } from '../../wallet/constants/schema'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { AdminDto } from './admin.dto'

export class ExternalPassAddressRequestDto extends AdminDto {
  @Length(1, BLOCKCHAIN_ADDRESS_LENGTH)
  @DtoProperty({ type: 'string' })
  address: string

  @DtoProperty({ type: 'uuid' })
  passId: string

  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}
