import {
  AuthLocalApi,
  UpdatePasswordRequestDto,
  UserApi
} from "@passes/api-client"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

const useAccountSettings = () => {
  const { user } = useUser()
  const userApi = new UserApi()
  const authApi = new AuthLocalApi()

  const setDisplayName = async (displayName: string) => {
    return await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const setProfilePicture = async (picture: File) => {
    return await new ContentService().uploadProfileImage(picture)
  }

  const changePassword = async (password: UpdatePasswordRequestDto) => {
    await authApi.changePassword({
      updatePasswordRequestDto: password
    })
  }

  return {
    userId: user?.id ?? "",
    setDisplayName,
    setProfilePicture,
    changePassword
  }
}

export default useAccountSettings
