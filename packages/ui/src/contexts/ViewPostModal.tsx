import { PostDto } from "@passes/api-client"
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction
} from "react"

interface ViewPostModalContextProps {
  readonly setPost: Dispatch<
    SetStateAction<
      (PostDto & { setIsRemoved?: Dispatch<SetStateAction<boolean>> }) | null
    >
  >
  viewPostActiveIndex: MutableRefObject<{ [key: string]: number } | null>
}

export const ViewPostModalContext = createContext<ViewPostModalContextProps>(
  {} as ViewPostModalContextProps
)
