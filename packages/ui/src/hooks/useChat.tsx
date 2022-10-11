import { MessagesApi } from "@passes/api-client"
import { accessTokenKey } from "src/helpers/token"
import { useLocalStorage } from "src/hooks/useLocalStorage"
import useSWR from "swr"

export const useChat = (userId: string) => {
  const [accessToken] = useLocalStorage(accessTokenKey, "")
  const channelId = useSWR(
    accessToken ? "/messages/channel" + "/" + userId : null,
    async () => {
      if (!userId) {
        return null
      }
      const api = new MessagesApi()

      const response = await api.getChannel({
        getChannelRequestDto: {
          userId
        }
      })
      return response.channelId
    }
  )

  return { channelId: channelId.data }
}
