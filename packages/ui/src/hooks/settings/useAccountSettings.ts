import {
  AuthLocalApi,
  UpdatePasswordRequestDto,
  UserApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

import { checkUsername } from "../../helpers/username"

export const useAccountSettings = () => {
  const router = useRouter()
  const { user, logout } = useUser()
  const userApi = new UserApi()
  const authApi = new AuthLocalApi()

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

  const changePassword = async (password: UpdatePasswordRequestDto) => {
    await authApi.changePassword({
      updatePasswordRequestDto: password
    })
    logout()
    router.push("/login")
  }

  return {
    setDisplayName,
    setUsername,
    setProfilePicture,
    getProfileUrl,
    changePassword
  }
}
