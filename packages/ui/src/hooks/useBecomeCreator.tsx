import { ProfileApi, UserApi } from "@passes/api-client"
import { wrapApi } from "src/helpers"

interface IMakeCreator {
  displayName: string
  description: string
  isAdult: boolean
}

const useBecomeCreator = () => {
  const userApi = wrapApi(UserApi)
  const profileApi = wrapApi(ProfileApi)

  const makeCreator = async ({
    description,
    displayName,
    isAdult
  }: IMakeCreator) => {
    await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })

    await profileApi.createOrUpdateProfile({
      createOrUpdateProfileRequestDto: { description }
    })

    if (isAdult) await userApi.makeAdult()
  }

  return {
    makeCreator
  }
}

export default useBecomeCreator
