import { MessagesApi } from "@passes/api-client"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

const useChat = (username: string) => {
  const [accessToken] = useLocalStorage("access-token", "")
  const channelId = useSWR(
    accessToken ? "/messages/channel" + "/" + username : null,
    async () => {
      if (!username) return null
      const api = wrapApi(MessagesApi)

      const createChannelRequestDto = {
        text: "",
        username: username
      }
      const response = await api.messagesCreateChannel({
        createChannelRequestDto
      })
      return response.id
    }
  )

  const streamToken = useSWR(
    accessToken ? "/messages/token" : null,
    async () => {
      const api = wrapApi(MessagesApi)
      const response = await api.messagesGetToken()
      return response.token
    }
  )

  return { channelId: channelId.data, streamToken: streamToken.data }
}

export default useChat
