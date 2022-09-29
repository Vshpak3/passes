import { PaymentApi } from "@passes/api-client"

import AuthWrapper from "../../components/wrappers/AuthWrapper"
import { usePay } from "../../hooks/usePay"

const PayPage = () => {
  const api = new PaymentApi()
  const register = async () => {
    return await api.registerPayin()
  }

  const registerData = async () => {
    return await api.registerPayinData()
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData
  )

  return (
    <AuthWrapper isPage>
      <button
        onClick={() => {
          submit()
        }}
        className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
        type="submit"
        {...(blocked || submitting ? { disabled: true } : {})}
      >
        {loading ? "loading" : `Pay ${amountUSD}`}
      </button>
    </AuthWrapper>
  )
}
export default PayPage
