import { WalletApi } from "@passes/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

const useUserConnectedWallets = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallets = [],
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/wallets" : null, async () => {
    const api = new WalletApi()
    const response = await api.walletFindAll({
      headers: { Authorization: "Bearer " + accessToken }
    })
    return response.wallets
  })

  return { wallets, loading, mutate }
}

export default useUserConnectedWallets
