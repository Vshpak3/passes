import { PostDto } from "@passes/api-client"
import { createContext, Dispatch, SetStateAction } from "react"

type ProfilePostContextProps = PostDto & {
  isRemoved?: boolean
  setIsRemoved?: Dispatch<SetStateAction<boolean>>
}

export const PostDataContext = createContext<ProfilePostContextProps>(
  {} as ProfilePostContextProps
)
