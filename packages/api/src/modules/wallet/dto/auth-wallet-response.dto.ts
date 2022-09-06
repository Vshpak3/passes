import { DtoProperty } from '../../../web/endpoint.web'
import { ChainEnum } from '../enum/chain.enum'

export class AuthWalletResponseDto {
  @DtoProperty()
  rawMessage: string

  @DtoProperty()
  walletAddress: string

  @DtoProperty()
  chain: ChainEnum
}
