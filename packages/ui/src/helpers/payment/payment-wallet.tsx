export const getPhantomProvider = () => {
  if ("phantom" in window) {
    const provider = (window as any).phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }
  return undefined
}
