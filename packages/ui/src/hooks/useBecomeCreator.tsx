import {
  CreateOrUpdateProfileRequestDto,
  ProfileApi,
  UserApi
} from "@passes/api-client"

interface IMakeCreator {
  profile: CreateOrUpdateProfileRequestDto
  displayName: string
  isAdult: boolean
}

const useBecomeCreator = () => {
  const userApi = new UserApi()
  const profileApi = new ProfileApi()

  const makeCreatorProfile = async ({
    profile,
    displayName,
    isAdult
  }: IMakeCreator) => {
    await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })

    await profileApi.createOrUpdateProfile({
      createOrUpdateProfileRequestDto: profile
    })

    if (isAdult) await userApi.makeAdult()
  }

  return {
    makeCreatorProfile
  }
}

export default useBecomeCreator
