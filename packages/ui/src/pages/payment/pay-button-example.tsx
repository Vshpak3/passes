import { PassApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { PayButton } from "../../components/payment/pay-button"
import { wrapApi } from "../../helpers/wrapApi"
import useUser from "../../hooks/useUser"

interface IPayPage {
  defaultPayin: any
  passId?: string | undefined
}

const PayPage = ({ passId }: IPayPage) => {
  const { user, loading } = useUser()
  const router = useRouter()
  const api = wrapApi(PassApi)

  const submit = async () => {
    return await api.passRegisterCreatePass({
      createPassHolderDto: {
        passId: passId || ""
      }
    })
  }

  const data = async () => {
    return await api.passRegisterCreatePassData({
      createPassHolderDto: {
        passId: passId || ""
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
