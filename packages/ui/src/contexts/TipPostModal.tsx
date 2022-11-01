import { PostDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface TipPostModalContextProps {
  readonly setPost: Dispatch<SetStateAction<PostDto | null>>
}

export const TipPostModalContext = createContext<TipPostModalContextProps>(
  {} as TipPostModalContextProps
)
