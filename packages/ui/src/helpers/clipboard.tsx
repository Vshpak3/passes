import { PostDto } from "@passes/api-client"
import copy from "copy-to-clipboard"
import ms from "ms"
import { toast } from "react-toastify"

export const copyLinkToClipboard = (post: PostDto) => {
  copy(window.location.origin + "/" + post.username + "/" + post.postId)

  toast("Link to post has been copied to clipboard!", {
    position: "bottom-left",
    autoClose: ms("3 seconds"),
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  })
}
