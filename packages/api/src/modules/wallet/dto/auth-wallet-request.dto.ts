import { Chain } from '../enum/chain.enum'

export class AuthWalletRequestDto {
  walletAddress: string

  chain: Chain
}
