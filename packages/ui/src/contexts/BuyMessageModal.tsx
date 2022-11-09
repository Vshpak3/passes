import { ChannelMemberDto, MessageDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface BuyMessageModalContextProps {
  readonly setMessage: Dispatch<SetStateAction<MessageDto | null>>
  readonly setSelectedChannel: Dispatch<SetStateAction<ChannelMemberDto | null>>
}

export const BuyMessageModalContext =
  createContext<BuyMessageModalContextProps>({} as BuyMessageModalContextProps)
