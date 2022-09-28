import {
  CircleCardDto,
  GetCircleCardResponseDto,
  PayinMethodDto,
  PaymentApi
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const usePayinMethod = () => {
  const [defaultPayinMethod, setDefaultPayinMethod] = useState<PayinMethodDto>()
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

      setDefaultPayinMethod(response)
    } catch (error: any) {
      console.error(error)
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
      console.error(error)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateDefaultPayinMethod(dto: PayinMethodDto) {
    try {
      setIsLoading(true)
      await api.setDefaultPayinMethod({
        setPayinMethodRequestDto: dto
      })

      getDefaultPayinMethod()
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
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      await getCards()
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
    defaultPayinMethod,
    isLoadingPayinMethod: isLoading,
    setDefaultPayinMethod: updateDefaultPayinMethod,
    getCardInfo,
    deleteCard
  }
}

export default usePayinMethod
