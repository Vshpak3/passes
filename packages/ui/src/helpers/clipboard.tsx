import copy from "copy-to-clipboard"
import ms from "ms"
import { toast } from "react-toastify"

export const copyLinkToClipboard = (username: string, postId: string) => {
  copy(window.location.origin + "/" + username + "/" + postId)

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
