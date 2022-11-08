import {
  CircleCardDto,
  CircleCardDtoStatusEnum,
  CircleCreateCardAndExtraRequestDto,
  PayinMethodDto,
  PaymentApi
} from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PAYIN_METHOD = "/payment/default-payin-method"
const CACHE_KEY_CARDS = "/payment/cards"

export const usePayinMethod = (
  disableOnLoad?: boolean,
  refreshInterval?: number
) => {
  const api = new PaymentApi()

  const {
    data: payinMethod,
    isValidating: isLoadingPayinMethod,
    mutate: mutatePayinMethod
  } = useSWR<PayinMethodDto>(
    CACHE_KEY_PAYIN_METHOD,
    async () => {
      return await api.getDefaultPayinMethod()
    },
    {
      refreshInterval
    }
  )

  const {
    data: cards,
    isValidating: isLoadingCards,
    mutate: mutateCards
  } = useSWR<CircleCardDto[]>(
    CACHE_KEY_CARDS,
    async () => {
      setTimeout(() => undefined, 500)
      return (await api.getCircleCards()).cards
    },
    { refreshInterval }
  )

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

  async function addCard(dto: CircleCreateCardAndExtraRequestDto) {
    const res = await api.createCircleCard({
      circleCreateCardAndExtraRequestDto: dto
    })
    const newCard: CircleCardDto = {
      id: res.id,
      circleId: res.circleId,
      status: res.status as CircleCardDtoStatusEnum,
      firstDigit: dto.cardNumber.slice(0, 1),
      fourDigits: dto.cardNumber.slice(-4),
      expMonth: dto.createCardDto.expMonth,
      expYear: dto.createCardDto.expYear,
      name: dto.createCardDto.billingDetails.name
    }
    mutateManualCards([...(cards || []), newCard])
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
    if (!payinMethod && !disableOnLoad) {
      mutatePayinMethod()
    }
    if (!cards && !disableOnLoad) {
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
    addCard,
    deleteCard,
    getCards: mutateCards,
    defaultCard
  }
}
