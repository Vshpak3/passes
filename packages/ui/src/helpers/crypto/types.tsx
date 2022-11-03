import type { ExternalProvider } from "@ethersproject/providers"
import type { PublicKey, Transaction } from "@solana/web3.js"

export type EthereumProvider = Required<ExternalProvider>

type PhantomEvent = "disconnect" | "connect" | "accountChanged"

interface PhantomProviderConnectOpts {
  onlyIfTrusted: boolean
}

export interface PhantomProvider {
  connect: (
    opts?: Partial<PhantomProviderConnectOpts>
  ) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  request: (value: PhantomProviderRequest) => Promise<{ signature: string }>
  on: (event: PhantomEvent, callback: (args: unknown) => void) => void
  off: (event: PhantomEvent) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signAndSendTransaction: (transaction: Transaction) => Promise<any>
  isPhantom: boolean
}

interface PhantomProviderRequest {
  method: string
  params: {
    message: Uint8Array
    display: string
  }
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solana?: PhantomProvider
  }
}

// Intended to mirror detectEthereumProvider; only supports Phantom for now
export const detectSolanaProvider = ({
  mustBePhantom = true
}: {
  mustBePhantom?: boolean
}): PhantomProvider | undefined => {
  if (mustBePhantom && !window.solana?.isPhantom) {
    return undefined
  }

  return window.solana
}
