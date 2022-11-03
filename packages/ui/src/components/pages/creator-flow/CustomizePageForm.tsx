import { yupResolver } from "@hookform/resolvers/yup"
import classNames from "classnames"
import _, { identity } from "lodash"
import ProfileDiscordIcon from "public/icons/profile-discord-icon.svg"
import ProfileFacebookIcon from "public/icons/profile-facebook-icon.svg"
import ProfileInstagramIcon from "public/icons/profile-instagram-icon.svg"
import ProfileTiktokIcon from "public/icons/profile-tiktok-icon.svg"
import ProfileTwitchIcon from "public/icons/profile-twitch-icon.svg"
import ProfileTwitterIcon from "public/icons/profile-twitter-icon.svg"
import ProfileYoutubeIcon from "public/icons/profile-youtube-icon.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { ButtonTypeEnum, PassesPinkButton } from "src/components/atoms/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Input } from "src/components/atoms/input/GeneralInput"
import { FormImage } from "src/components/organisms/FormImage"
import { errorMessage } from "src/helpers/error"
import { updateProfile } from "src/helpers/updateProfile"
import { useUser } from "src/hooks/useUser"
import { creatorFlowProfileSchema } from "./helper/CreatorFlowProfileSchema"

interface CreatorFlowCustomizeFormProps {
  displayName: string
  description: string

  profileImage: File[]
  profileBannerImage: File[]

  discordUsername: string
  facebookUsername: string
  instagramUsername: string
  tiktokUsername: string
  twitchUsername: string
  twitterUsername: string
  youtubeUsername: string

  isAdult: boolean
}

interface ConnectedAccountsProps {
  discord: boolean
  facebook: boolean
  instagram: boolean
  tiktok: boolean
  twitch: boolean
  twitter: boolean
  youtube: boolean
}

type CustomizePageFormProps = {
  onFinishCustomizePage?: () => void
}

export const CustomizePageForm: FC<CustomizePageFormProps> = ({
  onFinishCustomizePage = identity
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectedAccounts, setConnectedAccounts] =
    useState<ConnectedAccountsProps>({
      discord: false,
      facebook: false,
      instagram: false,
      tiktok: false,
      twitch: false,
      twitter: false,
      youtube: false
    })
  const { user } = useUser()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreatorFlowCustomizeFormProps>({
    defaultValues: {
      displayName: user?.displayName || "",
      // TODO: the profile image might already be set
      profileImage: [],
      profileBannerImage: []
    },
    resolver: yupResolver(creatorFlowProfileSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const profileImage = watch("profileImage")
  const profileBannerImage = watch("profileBannerImage")

  const saveProfileHandler = async (data: CreatorFlowCustomizeFormProps) => {
    const {
      displayName,
      description,
      profileImage,
      profileBannerImage,
      isAdult,
      ...socialAccounts
    } = data

    await updateProfile({
      displayName,
      description,
      profileImage: profileImage,
      profileBannerImage: profileBannerImage,
      isAdult,
      ..._.pickBy(socialAccounts, _.identity)
    })
    onFinishCustomizePage()
  }

  const onSubmit = async (data: CreatorFlowCustomizeFormProps) => {
    try {
      setIsSubmitting(true)
      await saveProfileHandler(data)
    } catch (error: unknown) {
      await errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (user?.displayName) {
      setValue("displayName", user.displayName)
    }
  }, [user?.displayName, setValue])

  return (
    <div className="flex justify-center pb-20 text-white">
      <form
        className="flex w-full max-w-screen-lg flex-col justify-center rounded-3xl border-gray-700 bg-black py-10 px-6 sm:-mt-12 sm:w-4/5 sm:border sm:py-24 sm:px-10 md:px-16 lg:px-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6 flex flex-col items-center justify-center">
          <p className="mb-3 text-2xl">Tell us about your page</p>
          <p className="hidden text-slate-400 sm:flex">
            All of this info you can change at any time!
          </p>
        </div>

        <div className="mb-6 flex flex-col">
          <FormImage
            cropHeight={300}
            cropWidth={1500}
            imgData={profileBannerImage}
            inputUI={
              <div className="z-10 flex w-full flex-col">
                <div className="relative w-full">
                  <img
                    alt=""
                    className={classNames(
                      errors.profileBannerImage
                        ? "border-2 !border-red-500"
                        : "",
                      "h-[115px] w-full cursor-pointer rounded-[15px] object-cover object-center"
                    )}
                    src={
                      profileBannerImage?.length
                        ? URL.createObjectURL(profileBannerImage[0])
                        : "/img/profile/select-banner-img.png"
                    }
                  />
                </div>
              </div>
            }
            name="profileBannerImage"
            register={register}
            setValue={setValue}
          />

          <FormImage
            cropHeight={400}
            cropWidth={400}
            imgData={profileImage}
            inputUI={
              <div className="relative -mt-20 ml-[26px] flex h-28 w-28 items-center justify-center rounded-full sm:-mt-24 sm:h-[138px] sm:w-[138px]">
                <img
                  alt=""
                  className={classNames(
                    errors.profileImage ? "border-2 !border-red-500" : "",
                    "z-20 h-full w-full cursor-pointer rounded-full border-transparent object-cover drop-shadow-profile-photo"
                  )}
                  src={
                    profileImage?.length
                      ? URL.createObjectURL(profileImage[0])
                      : "/img/profile/select-profile-img.png"
                  }
                />
              </div>
            }
            name="profileImage"
            register={register}
            setValue={setValue}
          />
        </div>

        <div className="mb-6 flex flex-col gap-6">
          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">Display Name</div>
            <Input
              className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              errors={errors}
              name="displayName"
              placeholder="Display Name"
              register={register}
              type="text"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">
              Profile Description
            </div>
            <Input
              className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              errors={errors}
              name="description"
              placeholder="Tell us more about yourself"
              register={register}
              type="text"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">
              Social Media Accounts
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileFacebookIcon className="h-[17px] w-[17px] shrink-0" />
              {connectedAccounts.facebook ? (
                <span>@fbusername</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="facebookUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileInstagramIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.instagram ? (
                <span>@instaname</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="instagramUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTwitterIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.twitter ? (
                <span>@twittername</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="twitterUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileDiscordIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.discord ? (
                <span>@discordname</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="discordUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTiktokIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.tiktok ? (
                <span>@tiktokname</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="tiktokUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTwitchIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.twitch ? (
                <span>@twitchname</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="twitchUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileYoutubeIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.youtube ? (
                <span>@youtubename</span>
              ) : (
                <Input
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="youtubeUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-[6px]">
          <Checkbox
            className="rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            labelClassName="text-[#b3bee7] opacity-[0.6]"
            name="isAdult"
            register={register}
            type="checkbox"
          />
          <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px] text-[#b3bee7] opacity-[0.6]">
            My work contains audio or visual creations depicting explicit sexual
            situations, including nudity in sexual contexts.
          </div>
        </div>

        <div className="mb-6 flex flex-col">
          <PassesPinkButton
            className="rounded-xl font-normal"
            isDisabled={isSubmitting}
            name="Continue"
            type={ButtonTypeEnum.SUBMIT}
          />
        </div>
      </form>
    </div>
  )
}
