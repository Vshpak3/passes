import { PassDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface BuyPassModalContextProps {
  readonly setPass: Dispatch<SetStateAction<PassDto | null>>
}

export const BuyPassModalContext = createContext<BuyPassModalContextProps>(
  {} as BuyPassModalContextProps
)
