import { MessagesApi } from "@passes/api-client"
import useSWR from "swr"

const api = new MessagesApi()
const TOTAL_UNREAD_MESSAGES_KEY = "/total/unread/messages"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useUnreadMessages = () => {
  const { data: count, mutate } = useSWR(
    TOTAL_UNREAD_MESSAGES_KEY,
    async () => {
      return (await api.getTotalUnreadMessages()).count
    },
    { revalidateOnMount: true }
  )

  return { count, mutate }
}
