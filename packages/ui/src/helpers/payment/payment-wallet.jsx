export const getPhantomProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }
  return undefined
}
