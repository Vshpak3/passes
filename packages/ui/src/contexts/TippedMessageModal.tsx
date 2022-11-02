import { SendMessageRequestDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface TippedMessageModalContextProps {
  readonly setMessage: Dispatch<SetStateAction<SendMessageRequestDto | null>>
}

export const TippedMessageModalContext =
  createContext<TippedMessageModalContextProps>(
    {} as TippedMessageModalContextProps
  )
