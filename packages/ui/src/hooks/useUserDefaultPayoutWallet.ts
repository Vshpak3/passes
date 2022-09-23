import { PaymentApi } from "@passes/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

const useUserDefaultPayoutWallet = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallet = {},
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/payout/default" : null, async () => {
    const api = new PaymentApi()
    return await api.getDefaultPayoutMethod()
  })

  return { wallet, loading, mutate }
}

export default useUserDefaultPayoutWallet
