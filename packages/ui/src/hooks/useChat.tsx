import { MessagesApi } from "@passes/api-client"
import useSWR from "swr"

import useLocalStorage from "./useLocalStorage"

const useChat = (username: string) => {
  const [accessToken] = useLocalStorage("access-token", "")

  const channelId = useSWR(
    accessToken ? "/messages/channel" : null,
    async () => {
      const api = new MessagesApi()

      const createChannelDto = {
        text: "",
        username: username
      }
      const response = await api.messagesCreateChannel(
        { createChannelDto },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
      return response.id
    }
  )

  const streamToken = useSWR(
    accessToken ? "/messages/token" : null,
    async () => {
      const api = new MessagesApi()

      const response = await api.messagesGetToken({
        headers: { Authorization: "Bearer " + accessToken }
      })

      return response.token
    }
  )

  return { channelId: channelId.data, streamToken: streamToken.data }
}

export default useChat
