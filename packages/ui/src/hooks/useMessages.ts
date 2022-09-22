import useSWR from "swr"

const mockedChannelsResponse = [
  {
    displayName: "Anna DeGuzman",
    messagePreview: "You: Hey back!..",
    channelId: "1"
  },
  {
    displayName: "user2938293",
    messagePreview: "You: Hey back!..",
    channelId: "2"
  },
  {
    displayName: "Kianna Press",
    messagePreview: "You: Hey back!..",
    channelId: "3"
  },
  {
    displayName: "Marilyn George",
    messagePreview: "You: Hey back!..",
    channelId: "4"
  }
]

const useMessages = (username: string) => {
  // const api = wrapApi(MessagesApi)
  const fetchChannels = async () => {
    // return await api.getChannels()
    return mockedChannelsResponse
  }
  const { data } = useSWR(["/messages/", username], fetchChannels)

  return {
    channels: data
  }
}

export default useMessages
