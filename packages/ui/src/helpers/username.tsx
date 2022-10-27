import { UserApi } from "@passes/api-client"

import { errorMessage } from "./error"

const api = new UserApi()

export async function checkUsername(username: string): Promise<void> {
  let usernameTaken
  try {
    usernameTaken = await api.isUsernameTaken({
      updateUsernameRequestDto: { username }
    })
  } catch (error: unknown) {
    throw new Error(await errorMessage(error))
  }

  if (usernameTaken.value) {
    throw new Error("This username is not available")
  }
}

const usernames: Record<string, string> = {}
export async function getUsername(userId: string) {
  return (usernames[userId] = await api.getUsernameFromId({ userId }))
}
