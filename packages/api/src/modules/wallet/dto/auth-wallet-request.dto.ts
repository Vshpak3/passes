import { DtoProperty } from '../../../web/endpoint.web'
import { ChainEnum } from '../enum/chain.enum'

export class AuthWalletRequestDto {
  @DtoProperty()
  walletAddress: string

  @DtoProperty()
  chain: ChainEnum
}
