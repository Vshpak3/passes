import { GetWalletsResponseDto, WalletApi } from "@passes/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

interface WalletsResponse {
  wallets: GetWalletsResponseDto | unknown[]
}

const useUserConnectedWallets = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallets = {} as WalletsResponse,
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/wallets" : null, async () => {
    const api = new WalletApi()
    return await api.getWallets()
  })

  return { wallets, loading, mutate }
}

export default useUserConnectedWallets
