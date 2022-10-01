import { WalletApi } from "@passes/api-client"
import useSWR from "swr"

import { accessTokenKey } from "../helpers/token"
import useLocalStorage from "./useLocalStorage"

const useUserConnectedWallets = () => {
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

export default useUserConnectedWallets
