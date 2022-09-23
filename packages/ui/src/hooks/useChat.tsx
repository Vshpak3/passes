import { MessagesApi } from "@passes/api-client"
import { useLocalStorage } from "src/hooks"
import useSWR from "swr"

const useChat = (username: string) => {
  const [accessToken] = useLocalStorage("access-token", "")
  const channelId = useSWR(
    accessToken ? "/messages/channel" + "/" + username : null,
    async () => {
      if (!username) return null
      const api = new MessagesApi()

      const response = await api.getChannel({
        getChannelRequestDto: {
          userId: username
        }
      })
      return response.channelId
    }
  )

  const streamToken = useSWR(
    accessToken ? "/messages/token" : null,
    async () => {
      const api = new MessagesApi()
      const response = await api.getToken()
      return response.token
    }
  )

  return { channelId: channelId.data, streamToken: streamToken.data }
}

export default useChat
