import { MessagesApi } from "@passes/api-client"
import useSWR from "swr"

const api = new MessagesApi()
const TOTAL_UNREAD_MESSAGES_KEY = "/total/unread/messages"
export const useCreatorBalance = () => {
  const { data: count, mutate } = useSWR(
    TOTAL_UNREAD_MESSAGES_KEY,
    async () => {
      return (await api.getTotalUnreadMessages()).count
    },
    { revalidateOnMount: true }
  )

  return { count, mutate }
}
