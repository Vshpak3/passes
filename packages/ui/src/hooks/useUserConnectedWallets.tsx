import { WalletApi } from "@passes/api-client"
import { useEffect } from "react"
import useSWR from "swr"

import { accessTokenKey } from "src/helpers/token"
import { useLocalStorage } from "./storage/useLocalStorage"

export const useUserConnectedWallets = () => {
  const [accessToken] = useLocalStorage(accessTokenKey, "")

  const {
    data: wallets,
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/wallets" : null, async () => {
    const api = new WalletApi()
    return (await api.getWallets()).wallets
  })

  useEffect(() => {
    if (!wallets) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { wallets, loading, mutate }
}
