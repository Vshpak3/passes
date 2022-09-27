import { ResponseError, UserApi } from "@passes/api-client"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

export const useAccountSettings = () => {
  const { user } = useUser()
  const userApi = new UserApi()

  const setDisplayName = async (displayName: string) => {
    return await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const setUsername = async (username: string) => {
    let usernameTaken
    try {
      usernameTaken = await userApi.isUsernameTaken({
        updateUsernameRequestDto: { username }
      })
    } catch (err: any) {
      const error = await (err as ResponseError).response.json()
      throw new Error(error.message[0])
    }

    if (usernameTaken.toString() === "true") {
      throw new Error("Username is not available")
    }

    return await userApi.setUsername({ updateUsernameRequestDto: { username } })
  }

  const getProfileUrl = () => {
    return ContentService.profileThumbnail(user?.id ?? "")
  }

  const setProfilePicture = async (picture: File) => {
    return await new ContentService().uploadProfileImage(picture)
  }

  return { setDisplayName, setUsername, setProfilePicture, getProfileUrl }
}
