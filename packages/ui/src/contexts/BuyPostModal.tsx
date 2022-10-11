import { PostDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface BuyPostModalContextProps {
  readonly setPost: Dispatch<SetStateAction<PostDto | null>>
}

export const BuyPostModalContext = createContext<BuyPostModalContextProps>(
  {} as BuyPostModalContextProps
)
