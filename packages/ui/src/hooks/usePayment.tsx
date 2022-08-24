import { PayinMethodDto, PaymentApi } from "@passes/api-client"
import { useEffect, useState } from "react"

import { wrapApi } from "../helpers/wrapApi"
const usePayment = () => {
  const [defaultPayinMethod, setDefaultPayinMethod] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cards, setCards] = useState<any[]>([])
  const api = wrapApi(PaymentApi)
  // const { user } = useUser()

  async function getDefaultPayinMethod() {
    try {
      setIsLoading(true)

      const response = await api.paymentGetDefaultPayinMethod()

      setDefaultPayinMethod(response)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getCards() {
    try {
      setIsLoading(true)
      const response = await api.paymentGetCircleCards()
      setCards(response)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateDefaultPayinMethod(dto: PayinMethodDto) {
    try {
      setIsLoading(true)
      await api.paymentSetDefaultPayinMethod({
        payinMethodDto: dto
      })

      getDefaultPayinMethod()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCard(cardId: string) {
    try {
      setIsLoading(true)
      await api.paymentDeleteCircleCard({
        circleCardId: cardId
      })
    } catch (error) {
      console.log(error)
    } finally {
      await getCards()
    }
  }

  useEffect(() => {
    getDefaultPayinMethod()
    getCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    cards,
    defaultPayinMethod,
    isLoadingPayinMethod: isLoading,
    setDefaultPayinMethod: updateDefaultPayinMethod,
    deleteCard
  }
}

export default usePayment
