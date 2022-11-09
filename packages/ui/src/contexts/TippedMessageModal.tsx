import { ChannelMemberDto, SendMessageRequestDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface TippedMessageModalContextProps {
  readonly setTippedMessage: Dispatch<
    SetStateAction<SendMessageRequestDto | null>
  >
  readonly setSelectedChannel: Dispatch<SetStateAction<ChannelMemberDto | null>>
  readonly setOnModalCallback: Dispatch<SetStateAction<(() => void) | null>>
}

export const TippedMessageModalContext =
  createContext<TippedMessageModalContextProps>(
    {} as TippedMessageModalContextProps
  )
