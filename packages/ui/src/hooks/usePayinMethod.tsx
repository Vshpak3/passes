import { CircleCardDto, PayinMethodDto, PaymentApi } from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PAYIN_METHOD = "/payment/default-payin-method"
const CACHE_KEY_CARDS = "/payment/cards"

export const usePayinMethod = () => {
  const api = new PaymentApi()

  const {
    data: payinMethod,
    isValidating: isLoadingPayinMethod,
    mutate: mutatePayinMethod
  } = useSWR<PayinMethodDto>(CACHE_KEY_PAYIN_METHOD, async () => {
    return await api.getDefaultPayinMethod()
  })

  const {
    data: cards,
    isValidating: isLoadingCards,
    mutate: mutateCards
  } = useSWR<CircleCardDto[]>(CACHE_KEY_CARDS, async () => {
    setTimeout(() => undefined, 500)
    return (await api.getCircleCards()).cards
  })

  const [defaultCard, setDefaultCard] = useState<CircleCardDto>()

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManualPayinMethod = (update: PayinMethodDto) =>
    _mutateManual(CACHE_KEY_PAYIN_METHOD, update, {
      populateCache: (update: PayinMethodDto) => {
        return update
      },
      revalidate: false
    })
  const mutateManualCards = (update: CircleCardDto[]) =>
    _mutateManual(CACHE_KEY_CARDS, update, {
      populateCache: (update: CircleCardDto[]) => {
        return update
      },
      revalidate: false
    })

  async function setDefaultPayinMethod(dto: PayinMethodDto) {
    await api.setDefaultPayinMethod({
      setPayinMethodRequestDto: dto
    })
    mutateManualPayinMethod(dto)
  }

  async function deleteCard(cardId: string) {
    await api.deleteCircleCard({
      circleCardId: cardId
    })
    mutateManualCards(cards?.filter((card) => card.id !== cardId) ?? [])
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
