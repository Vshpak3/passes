import { CardEntityDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

// import { v4 } from "uuid"
import useLocalStorage from "../../hooks/useLocalStorage"
import useUser from "../../hooks/useUser"

const ChooseCard = () => {
  const [submitting, setSubmitting] = useState(false)
  const [defaultCard, setDefaultCard] = useState("")
  const [cards, setCards] = useState([] as CardEntityDto[])
  const [accessToken] = useLocalStorage("access-token", "")
  // const idempotencyKey = v4()

  const { user, loading } = useUser()
  const router = useRouter()
  const { handleSubmit } = useForm({
    defaultValues: {}
  })
  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/")
    }
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      const cards = await paymentApi.paymentGetCards({
        headers: { Authorization: "Bearer " + accessToken }
      })
      const defaultCard = await paymentApi.paymentGetDefaultCard({
        headers: { Authorization: "Bearer " + accessToken }
      })
      // const gemApi = new GemApi()
      console.log(router.query)
      // const package = await gemApi.gemGetPackage()
      if (cards.length == 0) {
        window.location.href = "/gems/new-card"
      }
      setDefaultCard(defaultCard.circleCardId)
      setCards(cards)
    }
    fetchData()
  }, [router, user, loading, accessToken])

  const payCard = async () => {
    setSubmitting(true)
    try {
      console.log("asdf")
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const payCrypto = async () => {
    setSubmitting(true)
    try {
      console.log("assdf")
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <select>
        {cards.map((card) => {
          return (
            <option
              key={card.circleCardId}
              value={card.circleCardId}
              {...(card.circleCardId === defaultCard ? { selected: true } : {})}
            >
              card ending in {card.fourDigits}, expires {card.expMonth}/
              {card.expYear}
            </option>
          )
        })}
      </select>
      <button
        onClick={() => {
          window.location.href = "/gems/new-card"
        }}
      >
        new card
      </button>
      <form onSubmit={handleSubmit(payCard)} className="form-classic">
        <button
          className="w-32 rounded-[50px] bg-[#C943A8] p-4"
          type="submit"
          {...(submitting ? { disabled: true } : {})}
        >
          pay with card
        </button>
      </form>
      <form onSubmit={handleSubmit(payCrypto)} className="form-classic">
        <button
          className="w-32 rounded-[50px] bg-[#C943A8] p-4"
          type="submit"
          {...(submitting ? { disabled: true } : {})}
        >
          pay with USDC on Solana
        </button>
      </form>
    </div>
  )
}
export default ChooseCard
