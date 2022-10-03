import { UserApi } from "@passes/api-client"

import { errorMessage } from "./error"

export async function checkUsername(
  username: string,
  userApi?: UserApi
): Promise<void> {
  if (!userApi) {
    userApi = new UserApi()
  }

  let usernameTaken
  try {
    usernameTaken = await userApi.isUsernameTaken({
      updateUsernameRequestDto: { username }
    })
  } catch (err: any) {
    throw new Error(await errorMessage(err))
  }

  if (usernameTaken.value) {
    throw new Error("This username is not available")
  }
}
