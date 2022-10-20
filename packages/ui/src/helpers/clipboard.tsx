import copy from "copy-to-clipboard"
import { toast } from "react-toastify"

export const copyLinkToClipboard = (username: string, postId: string) => {
  copy(window.location.origin + "/" + username + "/" + postId)

  toast.success("Link to post has been copied to clipboard")
}
