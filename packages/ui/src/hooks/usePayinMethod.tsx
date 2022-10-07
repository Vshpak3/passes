import {
  CircleCardDto,
  GetCircleCardResponseDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { errorMessage } from "src/helpers/error"

const usePayinMethod = () => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cards, setCards] = useState<CircleCardDto[]>([])
  const [cardInfo, setCardInfo] = useState<GetCircleCardResponseDto | null>(
    null
  )
  const api = new PaymentApi()

  async function getDefaultPayinMethod() {
    try {
      setIsLoading(true)

      const response = await api.getDefaultPayinMethod()
      setPayinMethod(response)
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  async function getCards() {
    try {
      setIsLoading(true)
      const response = await api.getCircleCards()
      setCards(response.cards)
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  async function setDefaultPayinMethod(dto: PayinMethodDto) {
    try {
      setIsLoading(true)
      await api.setDefaultPayinMethod({
        setPayinMethodRequestDto: dto
      })
      setPayinMethod(dto)
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCard(cardId: string) {
    try {
      setIsLoading(true)
      await api.deleteCircleCard({
        circleCardId: cardId
      })
      if (payinMethod?.cardId === cardId) {
        setPayinMethod({ method: PayinMethodDtoMethodEnum.None })
      }
      setCards(cards.filter((card) => card.id != cardId))
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  async function getCardInfo(cardId: string) {
    try {
      setIsLoading(true)
      const response = await api.getCircleCard({
        cardId
      })
      setCardInfo(response)
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDefaultPayinMethod()
    getCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    cards,
    cardInfo,
    defaultPayinMethod: payinMethod,
    isLoadingPayinMethod: isLoading,
    getDefaultPayinMethod,
    setDefaultPayinMethod,
    getCardInfo,
    deleteCard,
    getCards,
    setPayinMethod
  }
}

export default usePayinMethod
