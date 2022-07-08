import { Chain } from '../enum/chain.enum'
export class AuthWalletResponseDto {
  rawMessage: string

  walletAddress: string

  chain: Chain
}
