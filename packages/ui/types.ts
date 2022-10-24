import { PublicKey } from "@solana/web3.js"

type PhantomEvent = "disconnect" | "connect" | "accountChanged"

interface PhantomProviderConnectOpts {
  onlyIfTrusted: boolean
}

interface PhantomProvider {
  connect: (
    opts?: Partial<PhantomProviderConnectOpts>
  ) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  request: (value: PhantomProviderRequest) => Promise<{ signature: string }>
  on: (event: PhantomEvent, callback: (args: unknown) => void) => void
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
    solana: PhantomProvider
  }
}
