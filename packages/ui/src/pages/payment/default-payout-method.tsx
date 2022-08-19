import {
  CircleBankDto,
  PaymentApi,
  PayoutMethodDto,
  PayoutMethodDtoMethodEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"

import useLocalStorage from "../../hooks/useLocalStorage"
import useUser from "../../hooks/useUser"

// const EVM_CHAINID = {
//   1: "Ethereum($ETH)",
//   5: "Ethereum($ETH)",

//   137: "Polygon($MATIC)",
//   80001: "Polygon($MATIC)",

//   43114: "Avalance($AVAX)",
//   43113: "Avalance($AVAX)"
// }

const DefaultPayoutMethod = () => {
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const [wallets, setWallets] = useState<WalletDto[]>([])

  const [defaultPayout, setDefaultPayout] = useState<PayoutMethodDto>()

  const { user, loading } = useUser()
  const router = useRouter()
  const [accessToken] = useLocalStorage("access-token", "")

  const getDefaultPayout = useCallback(
    async (api: PaymentApi) => {
      try {
        setDefaultPayout(
          await api.paymentGetDefaultPayoutMethod({
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          })
        )
      } catch (error) {
        setDefaultPayout(undefined)
      }
    },
    [accessToken]
  )

  const getBanks = useCallback(
    async (paymentApi: PaymentApi) => {
      setBanks(
        await paymentApi.paymentGetCircleBanks({
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        })
      )
    },
    [accessToken]
  )

  const getWallets = useCallback(
    async (walletApi: WalletApi) => {
      setWallets(
        await walletApi.walletFindAll({
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        })
      )
    },
    [accessToken]
  )

  const submit = async (dto: PayoutMethodDto) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.paymentSetDefaultPayoutMethod(
        { payoutMethodDto: dto },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
    } catch (error) {
      console.log(error)
    } finally {
      await getDefaultPayout(paymentApi)
    }
  }

  const deleteBank = async (bankId: string) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.paymentDeleteCircleBank(
        { circleBankId: bankId },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
    } catch (error) {
      console.log(error)
    } finally {
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      console.log("r2")
      return
    }
    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      const walletApi = new WalletApi()
      await getBanks(paymentApi)
      await getWallets(walletApi)
      await getDefaultPayout(paymentApi)
    }
    fetchData()
  }, [router, user, loading, getBanks, getWallets, getDefaultPayout])

  return (
    <div>
      <p>
        Your current payout method: {defaultPayout === undefined && "none"}
        {defaultPayout !== undefined &&
          "method - " +
            defaultPayout.method +
            " | bankId - " +
            defaultPayout.bankId +
            " | walletId - " +
            defaultPayout.walletId}
      </p>
      <br />
      {banks?.map((bank, i) => {
        return (
          <div key={i}>
            <button
              onClick={() => {
                submit({
                  bankId: bank.id,
                  method: PayoutMethodDtoMethodEnum.CircleWire
                })
              }}
              {...(bank.status !== "complete" ? { disabled: true } : {})}
            >
              Bank: {bank.description}
              status: {bank.status}
            </button>

            <br />
            <button
              onClick={() => {
                deleteBank(bank.id)
              }}
            >
              delete
            </button>
            <br />
          </div>
        )
      })}
      {wallets?.map((wallet, i) => {
        return (
          <div key={i}>
            <button
              onClick={() => {
                submit({
                  walletId: wallet.id,
                  method: PayoutMethodDtoMethodEnum.CircleUsdc
                })
              }}
            >
              Address: {wallet.address}
              chain: {wallet.chain}
            </button>

            <br />
          </div>
        )
      })}
    </div>
  )
}
export default DefaultPayoutMethod
