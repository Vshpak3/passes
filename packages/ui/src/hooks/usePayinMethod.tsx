import {
  CircleCardDto,
  GetCircleCardResponseDto,
  PayinMethodDto,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const usePayinMethod = () => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [cards, setCards] = useState<CircleCardDto[]>([])
  const [cardInfo, setCardInfo] = useState<GetCircleCardResponseDto | null>(
    null
  )
  const api = new PaymentApi()
  // const { user } = useUser()

  async function getDefaultPayinMethod() {
    try {
      setIsLoading(true)

      const response = await api.getDefaultPayinMethod()
      setPayinMethod(response)
    } catch (error: any) {
      toast.error(error)
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
      toast.error(error)
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

      if (dto.chain) {
        dto.chain = dto.chain.toUpperCase() as PayinMethodDtoChainEnum
      }
      setPayinMethod(dto)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
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
      console.error(error)
      toast.error(error)
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
      console.error(error)
      toast.error(error)
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
    deleteCard
  }
}

export default usePayinMethod
