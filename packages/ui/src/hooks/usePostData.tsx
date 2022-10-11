import { useContext } from "react"
import { PostDataContext } from "src/contexts/PostData"

export const usePostData = () => {
  return useContext(PostDataContext)
}
