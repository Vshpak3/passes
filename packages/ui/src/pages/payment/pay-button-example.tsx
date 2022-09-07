import { PaymentApi } from "@passes/api-client"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import { wrapApi } from "../../helpers/wrapApi"
import { usePay } from "../../hooks/usePay"

const PayPage = () => {
  const api = wrapApi(PaymentApi)
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
    <AuthOnlyWrapper isPage>
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
    </AuthOnlyWrapper>
  )
}
export default PayPage
