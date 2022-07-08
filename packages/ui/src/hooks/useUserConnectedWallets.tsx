import { WalletApi } from "@moment/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

interface UserConnectedWallet {
  id: string
  createdAt: string
  updatedAt: string
  user: string
  address: string
  chain: "eth" | "sol"
}

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
    return response as UserConnectedWallet[]
  })

  return { wallets, loading, mutate }
}

export default useUserConnectedWallets
