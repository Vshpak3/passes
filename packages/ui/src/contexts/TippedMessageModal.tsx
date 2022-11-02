import { SendMessageRequestDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface TippedMessageModalContextProps {
  readonly setTippedMessage: Dispatch<
    SetStateAction<SendMessageRequestDto | null>
  >
  readonly setOnSuccess: Dispatch<SetStateAction<(() => void) | null>>
}

export const TippedMessageModalContext =
  createContext<TippedMessageModalContextProps>(
    {} as TippedMessageModalContextProps
  )
