import { UserApi } from "@passes/api-client"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

import { checkUsername } from "../../helpers/username"

export const useAccountSettings = () => {
  const { user } = useUser()
  const userApi = new UserApi()

  const setDisplayName = async (displayName: string) => {
    return await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const setUsername = async (username: string) => {
    await checkUsername(username, userApi)
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
