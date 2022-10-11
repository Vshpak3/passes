import { PostDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

interface ViewPostModalContextProps {
  readonly setPost: Dispatch<
    SetStateAction<
      (PostDto & { setIsRemoved?: Dispatch<SetStateAction<boolean>> }) | null
    >
  >
}

export const ViewPostModalContext = createContext<ViewPostModalContextProps>(
  {} as ViewPostModalContextProps
)
