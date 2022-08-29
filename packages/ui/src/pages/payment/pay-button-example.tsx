import { PaymentApi } from "@passes/api-client"

import { wrapApi } from "../../helpers/wrapApi"
import { usePay } from "../../hooks/usePay"

const PayPage = () => {
  const api = wrapApi(PaymentApi)
  const register = async () => {
    return await api.paymentRegisterPayin()
  }

  const registerData = async () => {
    return await api.paymentRegisterPayinData()
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData
  )

  return (
    <button
      onClick={() => {
        submit()
      }}
      className="w-32 rounded-[50px] bg-[#C943A8] p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
export default PayPage
