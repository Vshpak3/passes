import { PhantomProvider } from "./payment/wallet-setup"

declare global {
  interface Window {
    // TODO: type these
    ethereum: any
    phantom: any
  }
}

export const getPhantomProvider = (): PhantomProvider | undefined => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }
  return undefined
}
