import { PhantomProvider } from "./wallet-setup"

export const getPhantomProvider = (): PhantomProvider | undefined => {
  if ("phantom" in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (window as any).phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }
  return undefined
}
