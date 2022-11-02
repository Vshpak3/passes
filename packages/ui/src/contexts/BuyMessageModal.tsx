import { MessageDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface BuyMessageModalContextProps {
  readonly setMessage: Dispatch<SetStateAction<MessageDto | null>>
}

export const BuyMessageModalContext =
  createContext<BuyMessageModalContextProps>({} as BuyMessageModalContextProps)
