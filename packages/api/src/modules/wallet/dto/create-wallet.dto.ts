import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class CreateWalletRequestDto {
  @DtoProperty()
  signedMessage: string

  @DtoProperty()
  rawMessage: string

  @DtoProperty()
  walletAddress: string

  @DtoProperty()
  chain: ChainEnum
}

export class CreateUnauthenticatedWalletRequestDto {
  @DtoProperty()
  walletAddress: string

  @DtoProperty()
  chain: ChainEnum
}
