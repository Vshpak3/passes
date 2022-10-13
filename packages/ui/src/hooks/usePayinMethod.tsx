import { CircleCardDto, PayinMethodDto, PaymentApi } from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR from "swr"

export const usePayinMethod = () => {
  const api = new PaymentApi()

  const {
    data: payinMethod,
    isValidating: isLoadingPayinMethod,
    mutate: mutatePayinMethod
  } = useSWR<PayinMethodDto>("/payment/default-payin-method", async () => {
    return await api.getDefaultPayinMethod()
  })

  const {
    data: cards,
    isValidating: isLoadingCards,
    mutate: mutateCards
  } = useSWR<CircleCardDto[]>("/payment/cards", async () => {
    setTimeout(() => undefined, 500)
    return (await api.getCircleCards()).cards
  })

  const [defaultCard, setDefaultCard] = useState<CircleCardDto>()

  async function setDefaultPayinMethod(dto: PayinMethodDto) {
    await api.setDefaultPayinMethod({
      setPayinMethodRequestDto: dto
    })
    setTimeout(() => undefined, 500)
    mutatePayinMethod()
  }

  async function deleteCard(cardId: string) {
    await api.deleteCircleCard({
      circleCardId: cardId
    })
    mutateCards()
  }

  useEffect(() => {
    setDefaultCard(cards?.find((card) => card.id === payinMethod?.cardId))
  }, [cards, payinMethod])

  useEffect(() => {
    if (!payinMethod) {
      mutatePayinMethod()
    }
    if (!cards) {
      mutateCards()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    cards,
    defaultPayinMethod: payinMethod,
    isLoadingPayinMethod,
    isLoadingCards,
    getDefaultPayinMethod: mutatePayinMethod,
    setDefaultPayinMethod,
    deleteCard,
    getCards: mutateCards,
    defaultCard
  }
}
