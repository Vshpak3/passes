import { PaymentApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers"
import useLocalStorage from "./useLocalStorage"

const useUserDefaultPayoutWallet = () => {
  const [accessToken] = useLocalStorage("access-token", "")

  const {
    data: wallet = {},
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? "/payout/default" : null, async () => {
    const api = wrapApi(PaymentApi)
    return await api.getDefaultPayoutMethod()
  })

  return { wallet, loading, mutate }
}

export default useUserDefaultPayoutWallet
