import { PhantomProvider } from "./payment/wallet-setup"

declare global {
  interface Window {
    // TODO: type these
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
