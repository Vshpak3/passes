import {
  CircleCardDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PaymentApi
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

const DefaultPayinMethod = () => {
  const [cards, setCards] = useState<CircleCardDto[]>([])
  const [defaultPayin, setDefaultPayin] = useState<PayinMethodDto>()

  const { user, loading } = useUser()
  const router = useRouter()
  const [accessToken] = useLocalStorage("access-token", "")

  const getDefaultPayin = useCallback(
    async (api: PaymentApi) => {
      try {
        setDefaultPayin(
          await api.paymentGetDefaultPayinMethod({
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          })
        )
      } catch (error) {
        setDefaultPayin(undefined)
      }
    },
    [accessToken]
  )

  const getCards = useCallback(
    async (paymentApi: PaymentApi) => {
      setCards(
        await paymentApi.paymentGetCircleCards({
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        })
      )
    },
    [accessToken]
  )

  const submit = async (dto: PayinMethodDto) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.paymentSetDefaultPayinMethod(
        { payinMethodDto: dto },
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
      await getDefaultPayin(paymentApi)
    }
  }

  const deleteCard = async (cardId: string) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.paymentDeleteCircleCard(
        { circleCardId: cardId },
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
      await getCards(paymentApi)
      await getDefaultPayin(paymentApi)
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
      await getCards(paymentApi)
      await getDefaultPayin(paymentApi)
    }
    fetchData()
  }, [router, user, loading, getCards, getDefaultPayin])

  return (
    <div>
      <p>
        Your current payment method: {defaultPayin === undefined && "none"}
        {defaultPayin !== undefined &&
          "method - " +
            defaultPayin.method +
            " | cardId - " +
            defaultPayin.cardId +
            " | chainId - " +
            defaultPayin.chainId}
      </p>
      <br />
      <button
        onClick={() => {
          submit({
            chainId: 5,
            method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
          })
        }}
      >
        ETH USDC on Metamask
      </button>
      <br />
      <button
        onClick={() => {
          submit({
            chainId: 43113,
            method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
          })
        }}
      >
        AVAX USDC on Metamask
      </button>
      <br />
      <button
        onClick={() => {
          submit({
            chainId: 80001,
            method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
          })
        }}
      >
        POLYGON USDC on Metamask
      </button>
      <br />
      <button
        onClick={() => {
          submit({
            method: PayinMethodDtoMethodEnum.PhantomCircleUsdc
          })
        }}
      >
        SOL USDC on Phantom
      </button>
      <br />
      <button
        onClick={() => {
          submit({
            chainId: 5,
            method: PayinMethodDtoMethodEnum.MetamaskCircleEth
          })
        }}
      >
        ETH on Metamask
      </button>
      <br />
      {cards?.map((card, i) => {
        return (
          <div key={i}>
            <button
              onClick={() => {
                submit({
                  cardId: card.id,
                  method: PayinMethodDtoMethodEnum.CircleCard
                })
              }}
              {...(card.status !== "complete" ? { disabled: true } : {})}
            >
              Card ending in {card.fourDigits} expiring on {card.expMonth}/
              {card.expYear}
              <br />
              status: {card.status}
            </button>

            <br />
            <button
              onClick={() => {
                deleteCard(card.id)
              }}
            >
              delete
            </button>
            <br />
          </div>
        )
      })}
    </div>
  )
}
export default DefaultPayinMethod
