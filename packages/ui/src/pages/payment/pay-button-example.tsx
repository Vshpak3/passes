import { PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { PayButton } from "../../components/payment/pay-button"
import useLocalStorage from "../../hooks/useLocalStorage"
import useUser from "../../hooks/useUser"

const PayPage = () => {
  const { user, loading } = useUser()
  const router = useRouter()
  const [accessToken] = useLocalStorage("access-token", "")

  const submit = async () => {
    const paymentApi = new PaymentApi()
    return await paymentApi.paymentRegisterPayin({
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    })
  }

  const data = async () => {
    const paymentApi = new PaymentApi()
    return await paymentApi.paymentRegisterPayinData({
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    })
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  return PayButton(submit, data)
}
export default PayPage
