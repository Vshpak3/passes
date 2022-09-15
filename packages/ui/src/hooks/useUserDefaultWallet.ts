import { WalletApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers"
import useLocalStorage from "./useLocalStorage"

const useUserDefaultWallet = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallet = {},
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/payin/default" : null, async () => {
    const api = wrapApi(WalletApi)
    return await api.getDefaultWallet()
  })

  return { wallet, loading, mutate }
}

export default useUserDefaultWallet
