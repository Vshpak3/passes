import { yupResolver } from "@hookform/resolvers/yup"
import classNames from "classnames"
import _, { identity } from "lodash"
import ProfileDiscordIcon from "public/icons/social/discord.svg"
import ProfileFacebookIcon from "public/icons/social/facebook.svg"
import ProfileInstagramIcon from "public/icons/social/instagram.svg"
import ProfileTikTokIcon from "public/icons/social/tiktok.svg"
import ProfileTwitchIcon from "public/icons/social/twitch.svg"
import ProfileTwitterIcon from "public/icons/social/twitter.svg"
import ProfileYoutubeIcon from "public/icons/social/youtube.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { array, object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Input } from "src/components/atoms/input/GeneralInput"
import { FormImage } from "src/components/organisms/FormImage"
import { errorMessage } from "src/helpers/error"
import { updateProfile } from "src/helpers/updateProfile"
import { displayNameSchema } from "src/helpers/validation/displayName"
import { socialMediaUsernameSchema } from "src/helpers/validation/social"
import { useUser } from "src/hooks/useUser"

interface CreatorFlowCustomizeFormProps {
  displayName: string
  description: string

  profileImage: File[]
  profileBanner: File[]

  discordUsername: string
  facebookUsername: string
  instagramUsername: string
  tiktokUsername: string
  twitchUsername: string
  twitterUsername: string
  youtubeUsername: string

  isAdult: boolean
}

const creatorFlowProfileSchema = object({
  ...displayNameSchema,
  description: string()
    .transform((name) => name.trim())
    .required("Please enter a bio"),
  profileImage: array().min(1, "Please upload a profile image"),
  profileBanner: array().optional(),
  ...socialMediaUsernameSchema
})

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
      profileBanner: []
    },
    resolver: yupResolver(creatorFlowProfileSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const profileImage = watch("profileImage")
  const profileBanner = watch("profileBanner")

  const saveProfileHandler = async (values: CreatorFlowCustomizeFormProps) => {
    const {
      displayName,
      description,
      profileImage,
      profileBanner,
      isAdult,
      ...socialAccounts
    } = values

    await updateProfile({
      displayName,
      description,
      profileImage,
      profileBanner,
      isAdult,
      ..._.pickBy(socialAccounts, _.identity)
    })
    onFinishCustomizePage()
  }

  const onSubmit = async (values: CreatorFlowCustomizeFormProps) => {
    try {
      setIsSubmitting(true)
      await saveProfileHandler(values)
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
            imgData={profileBanner}
            inputUI={
              <div className="z-10 flex w-full flex-col">
                <div className="relative w-full">
                  <img
                    alt=""
                    className={classNames(
                      errors.profileBanner && "border-2 !border-red-500",
                      "h-[115px] w-full cursor-pointer rounded-[15px] object-cover object-center"
                    )}
                    src={
                      profileBanner?.length
                        ? URL.createObjectURL(profileBanner[0])
                        : "/img/profile/select-banner-img.png"
                    }
                  />
                </div>
              </div>
            }
            name="profileBanner"
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
            <div className="text-[#b3bee7] opacity-[0.75]">Display Name</div>
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
            <div className="text-[#b3bee7] opacity-[0.75]">
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
            <div className="text-[#b3bee7] opacity-[0.75]">
              Social Media Accounts
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileFacebookIcon className="h-[17px] w-[17px] shrink-0" />
              {connectedAccounts.facebook ? (
                <span>@fbusername</span>
              ) : (
                <Input
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="discordUsername"
                  placeholder="Enter username"
                  register={register}
                  type="text"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTikTokIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.tiktok ? (
                <span>@tiktokname</span>
              ) : (
                <Input
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
                  className="w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
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
            className="rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-passes-gray dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            labelClassName="text-[#b3bee7] opacity-[0.75]"
            name="isAdult"
            register={register}
            type="checkbox"
          />
          <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px] text-[#b3bee7] opacity-[0.75]">
            My work contains audio or visual creations depicting explicit sexual
            situations, including nudity in sexual contexts.
          </div>
        </div>

        <div className="mb-6 flex flex-col">
          <Button
            className="rounded-xl font-normal"
            disabled={isSubmitting}
            type={ButtonTypeEnum.SUBMIT}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
