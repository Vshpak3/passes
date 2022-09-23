import { UserApi } from "@passes/api-client"

export const useAccountSettings = () => {
  const userApi = new UserApi()

  const validateUsername = async (username: string) => {
    return await userApi.validateUsername({ username })
  }

  const setDisplayName = async (displayName: string) => {
    return await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const setUsername = async (username: string) => {
    const isValidUsername = await validateUsername(username)

    if (!eval(isValidUsername.toString())) {
      throw new Error("username is not available")
    }

    return await userApi.setUsername({ updateUsernameRequestDto: { username } })
  }

  return { setDisplayName, setUsername }
}
