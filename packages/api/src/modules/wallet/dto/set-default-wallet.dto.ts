import { DtoProperty } from '../../../web/dto.web'
import { ChainEnum } from '../enum/chain.enum'

export class SetDefaultWalletRequestDto {
  @DtoProperty({ custom_type: ChainEnum })
  chain: ChainEnum

  @DtoProperty({ type: 'uuid' })
  walletId: string
}
