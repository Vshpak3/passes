import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../../wallet/enum/chain.enum'
import { AdminDto } from './admin.dto'

export class ExternalPassAddressRequestDto extends AdminDto {
  @DtoProperty()
  address: string

  @DtoProperty()
  passId: string

  @DtoProperty()
  chain: ChainEnum
}
