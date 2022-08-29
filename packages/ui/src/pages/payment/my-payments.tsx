import { PayinDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { wrapApi } from "../../helpers"
import Payin from "../../helpers/payment/payin"
import { useLocalStorage } from "../../hooks"
import useUser from "../../hooks/useUser"

const PAGE_SIZE = 5

const MyPayments = () => {
  const [payins, setPayins] = useState<Array<PayinDto>>()
  const [count, setCount] = useState<number>(0)

  const { user, loading } = useUser()
  const router = useRouter()
  const [page, setPage] = useLocalStorage<number>("payment-page-number", 0)

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = wrapApi(PaymentApi)
      const payinListResponse = await paymentApi.paymentGetPayins({
        payinListRequestDto: { offset: PAGE_SIZE * page, limit: PAGE_SIZE }
      })
      setPayins(payinListResponse.payins)
      setCount(payinListResponse.count)
    }
    fetchData()
  }, [router, user, loading, page])

  return (
    <div>
      {Array.from({ length: Math.ceil(count / PAGE_SIZE) }).map((_, i) => {
        return (
          <button
            key={i}
            onClick={() => {
              setPage(i)
            }}
          >
            {i + 1}
          </button>
        )
      })}
      <br />
      {payins?.map((payin, i) => {
        return (
          <div key={i}>
            {Payin(payin)}
            <br />
          </div>
        )
      })}
    </div>
  )
}
export default MyPayments
