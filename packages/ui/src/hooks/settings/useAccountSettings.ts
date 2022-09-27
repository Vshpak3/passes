import { UserApi } from "@passes/api-client"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

export const useAccountSettings = () => {
  const { user } = useUser()
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

  const getProfileUrl = () => {
    if (!user?.id) return "/pages/profile/profile-photo.jpeg"
    return ContentService.profileImage(user?.id)
  }

  const setProfilePicture = async (picture: File) => {
    return await new ContentService().uploadProfileImage(picture)
  }

  return { setDisplayName, setUsername, setProfilePicture, getProfileUrl }
}
