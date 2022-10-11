import { WalletApi } from "@passes/api-client"
import { accessTokenKey } from "src/helpers/token"
import useSWR from "swr"

import { useLocalStorage } from "./useLocalStorage"

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

  return { wallets, loading, mutate }
}
