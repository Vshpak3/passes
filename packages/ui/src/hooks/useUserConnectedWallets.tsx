import { WalletApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"
import useLocalStorage from "./useLocalStorage"

const useUserConnectedWallets = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallets = [],
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/wallets" : null, async () => {
    const api = wrapApi(WalletApi)
    return await api.getWallets()
  })

  return { wallets, loading, mutate }
}

export default useUserConnectedWallets
