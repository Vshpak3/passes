import { PublicKey } from '@solana/web3.js'
import { ethers } from 'ethers'

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
