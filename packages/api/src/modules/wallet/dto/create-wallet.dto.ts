import { Chain } from '../enum/chain.enum'
export class CreateWalletDto {
  signedMessage: string

  rawMessage: string

  walletAddress: string

  chain: Chain
}
