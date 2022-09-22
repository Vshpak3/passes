import { yupResolver } from "@hookform/resolvers/yup"
import _, { identity } from "lodash"
import CameraIcon from "public/icons/profile-camera-icon.svg"
import ProfileDiscordIcon from "public/icons/profile-discord-icon.svg"
import ProfileFacebookIcon from "public/icons/profile-facebook-icon.svg"
import ProfileInstagramIcon from "public/icons/profile-instagram-icon.svg"
import ProfileTiktokIcon from "public/icons/profile-tiktok-icon.svg"
import ProfileTwitchIcon from "public/icons/profile-twitch-icon.svg"
import ProfileTwitterIcon from "public/icons/profile-twitter-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text } from "src/components/atoms"
import { ButtonTypeEnum, PassesPinkButton } from "src/components/atoms/Button"
import { creatorFlowProfileSchema } from "src/helpers/validation"
import { useBecomeCreator, useUser } from "src/hooks"

interface IFormData {
  displayName: string
  bio: string
  "free-dm-month-checkbox": boolean
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  discordUrl: string
  tiktokUrl: string
  twitchUrl: string
}

interface IConnectedAccounts {
  facebook: boolean
  instagram: boolean
  twitter: boolean
  discord: boolean
  tiktok: boolean
  twitch: boolean
}

type CustomizePageFormProps = {
  onCustomizePageFinish?: () => void
}

const CustomizePageForm = ({
  onCustomizePageFinish = identity
}: CustomizePageFormProps) => {
  const { makeCreatorProfile } = useBecomeCreator()
  const [connectedAccounts] = useState<IConnectedAccounts>({
    facebook: false,
    instagram: false,
    twitter: false,
    discord: false,
    tiktok: false,
    twitch: false
  })
  const { user } = useUser()
  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    defaultValues: { displayName: user?.displayName || "" },
    resolver: yupResolver(creatorFlowProfileSchema)
  })

  const saveProfileHandler = () => {
    const {
      displayName,
      bio: description,
      "free-dm-month-checkbox": isAdult,
      ...socialAccounts
    } = getValues()

    if (Object.values(socialAccounts).filter(Boolean).length === 0) {
      setError("facebookUrl", {
        type: "required",
        message: "Please enter at least 1 social url"
      })
      return
    }

    makeCreatorProfile({
      displayName,
      isAdult,
      profile: { description, ..._.pickBy(socialAccounts, _.identity) }
    })
    onCustomizePageFinish()
  }

  useEffect(() => {
    if (user?.displayName) setValue("displayName", user.displayName)
  }, [user?.displayName, setValue])

  return (
    <div className="flex justify-center pb-20 text-white">
      <form
        onSubmit={handleSubmit(saveProfileHandler)}
        className="flex w-full max-w-screen-lg flex-col justify-center rounded-3xl border-gray-700 bg-black py-10 sm:-mt-12 sm:w-4/5 sm:border sm:py-24 sm:px-40"
      >
        <div className="mb-6 flex flex-col items-center justify-center px-16 sm:px-32">
          <p className="mb-3 text-2xl">Tell us about your page</p>
          <p className="flex text-center text-slate-400 sm:hidden">
            Every creator gets their own page, and your page name is how moments
            will know you and search for you. You can change it at any time.
          </p>
          <p className="hidden text-slate-400 sm:flex">
            Every creator gets their own page, and your page
          </p>
          <p className="hidden text-slate-400 sm:flex">
            name is how moments will know you and search for
          </p>
          <p className="hidden text-slate-400 sm:flex">
            you. You can change it at any time.
          </p>
        </div>

        <div className="mb-6 flex flex-col px-12 sm:px-20">
          <div className="cover-image flex w-full justify-center rounded-xl py-11">
            <CameraIcon />
          </div>
          <div className="cover-image -mt-16 ml-3 flex h-24 w-24 items-center justify-center rounded-full sm:-mt-20 sm:ml-6 sm:h-32 sm:w-32">
            <CameraIcon />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-6 px-12 sm:px-28">
          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">Display Name</div>
            <FormInput
              register={register}
              name="displayName"
              className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              placeholder="Display Name"
              type="text"
              errors={errors}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">Bio*</div>
            <FormInput
              register={register}
              name="bio"
              className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              placeholder="Tell us more about yourself"
              type="text"
              errors={errors}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">
              Social Media Links* (connect minimum 1)
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileFacebookIcon className="h-[17px] w-[17px] flex-shrink-0" />
              {connectedAccounts.facebook ? (
                <span>@fbusername</span>
              ) : (
                <FormInput
                  register={register}
                  name="facebookUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileInstagramIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.instagram ? (
                <span>@instaname</span>
              ) : (
                <FormInput
                  register={register}
                  name="instagramUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTwitterIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.twitter ? (
                <span>@twtername</span>
              ) : (
                <FormInput
                  register={register}
                  name="twitterUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileDiscordIcon className="h-[17px] w-[17px]" />

              {connectedAccounts.discord ? (
                <span>@discordnam</span>
              ) : (
                <FormInput
                  register={register}
                  name="discordUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTiktokIcon className="h-[17px] w-[17px]" />

              {connectedAccounts.tiktok ? (
                <span>@tiktoknam</span>
              ) : (
                <FormInput
                  register={register}
                  name="tiktokUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTwitchIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.twitch ? (
                <span>@twitchnam</span>
              ) : (
                <FormInput
                  register={register}
                  name="twitchUrl"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter Url"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            {errors.facebookUrl && (
              <Text fontSize={12} className="mt-1 text-[red]">
                {errors.facebookUrl.message}
              </Text>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-[6px] px-12 sm:px-20">
          <FormInput
            register={register}
            type="checkbox"
            name="free-dm-month-checkbox"
            label="Yes"
            className="rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            labelClassName="text-[#b3bee7] opacity-[0.6]"
          />
          <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px] text-[#b3bee7] opacity-[0.6]">
            My work contains audio or visual creations depicting explicit sexual
            situations, including nudity in sexual contexts.
          </div>
        </div>

        <div className="mb-6 flex flex-col px-12 sm:px-20">
          <PassesPinkButton
            name="Continue"
            type={ButtonTypeEnum.SUBMIT}
            className="rounded-xl font-normal"
          />
        </div>
      </form>
    </div>
  )
}

export default CustomizePageForm
