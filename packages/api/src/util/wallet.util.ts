import { PublicKey } from '@solana/web3.js'
import { ethers } from 'ethers'

import { ChainEnum } from '../modules/wallet/enum/chain.enum'

export function validateSolAddress(address: string) {
  try {
    const pubkey = new PublicKey(address)
    return PublicKey.isOnCurve(pubkey.toBuffer())
  } catch (error) {
    return false
  }
}

export function validateEthAddress(address: string) {
  return ethers.utils.isAddress(address)
}

export function validateAddress(address: string, chain: ChainEnum) {
  switch (chain) {
    case ChainEnum.ETH:
    case ChainEnum.AVAX:
    case ChainEnum.MATIC:
      return validateEthAddress(address)
    case ChainEnum.SOL:
      return validateSolAddress(address)
    default:
      return false
  }
}
