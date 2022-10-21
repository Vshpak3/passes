import { useContext } from "react"
import { BuyPassModalContext } from "src/contexts/BuyPassModal"

export const useBuyPassModal = () => {
  return useContext(BuyPassModalContext)
}
