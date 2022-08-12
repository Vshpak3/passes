import { PayinDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import Payin from "../../components/payment/payin"
import { useLocalStorage } from "../../hooks"
import useUser from "../../hooks/useUser"

const PAGE_SIZE = 5

const MyPayments = () => {
  const [payins, setPayins] = useState<Array<PayinDto>>()
  const [count, setCount] = useState<number>(0)

  const { user, loading } = useUser()
  const router = useRouter()
  const [accessToken] = useLocalStorage("access-token", "")
  const [page, setPage] = useLocalStorage<number>("payment-page-number", 0)

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      const payinListResponse = await paymentApi.paymentGetPayins(
        {
          payinListRequestDto: { offset: PAGE_SIZE * page, limit: PAGE_SIZE }
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
      setPayins(payinListResponse.payins)
      setCount(payinListResponse.count)
    }
    fetchData()
  }, [router, user, loading, page, accessToken])

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
            {Payin(payin, accessToken)}
            <br />
          </div>
        )
      })}
    </div>
  )
}
export default MyPayments
