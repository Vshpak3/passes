import { ResponseError, UserApi } from "@passes/api-client"

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
    const error = await (err as ResponseError).response.json()
    throw new Error(error.message[0])
  }

  if (usernameTaken.value) {
    throw new Error("Username is not available")
  }
}
