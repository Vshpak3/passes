import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class GetCustodialWalletRequestDto {
  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum
}
