import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class GetDefaultWalletRequestDto {
  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}
