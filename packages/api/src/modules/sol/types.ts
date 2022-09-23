import { PublicKey } from '@solana/web3.js'

export type Creator = Readonly<{
  address: PublicKey
  verified: boolean
  share: number
}>
