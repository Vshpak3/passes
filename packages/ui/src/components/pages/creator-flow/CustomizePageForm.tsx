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
import { FormInput } from "src/components/atoms"
import { ButtonTypeEnum, PassesPinkButton } from "src/components/atoms/Button"
import FormImage from "src/components/organisms/FormImage"
import { updateProfile } from "src/helpers"
import { creatorFlowProfileSchema } from "src/helpers/validation"
import { useUser } from "src/hooks"

interface IFormData {
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

interface IConnectedAccounts {
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

const CustomizePageForm = ({
  onFinishCustomizePage = identity
}: CustomizePageFormProps) => {
  const [connectedAccounts] = useState<IConnectedAccounts>({
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
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IFormData>({
    defaultValues: { displayName: user?.displayName || "" },
    resolver: yupResolver(creatorFlowProfileSchema)
  })

  const profileImage = watch("profileImage")
  const profileBannerImage = watch("profileBannerImage")

  const saveProfileHandler = async () => {
    const {
      displayName,
      description,
      profileImage,
      profileBannerImage,
      isAdult,
      ...socialAccounts
    } = getValues()

    await updateProfile({
      displayName,
      description,
      profileImage: profileImage[0],
      profileBannerImage: profileBannerImage[0],
      isAdult,
      ..._.pickBy(socialAccounts, _.identity)
    })
    onFinishCustomizePage()
  }

  useEffect(() => {
    if (user?.displayName) {
      setValue("displayName", user.displayName)
    }
  }, [user?.displayName, setValue])

  return (
    <div className="flex justify-center pb-20 text-white">
      <form
        onSubmit={handleSubmit(saveProfileHandler)}
        className="flex w-full max-w-screen-lg flex-col justify-center rounded-3xl border-gray-700 bg-black py-10 sm:-mt-12 sm:w-4/5 sm:border sm:py-24 sm:px-40"
      >
        <div className="mb-6 flex flex-col items-center justify-center px-16 sm:px-32">
          <p className="mb-3 text-2xl">Tell us about your page</p>
          <p className="hidden text-slate-400 sm:flex">
            All of this info you can change at any time!
          </p>
        </div>

        <div className="mb-6 flex flex-col px-12 sm:px-20">
          <FormImage
            setValue={setValue}
            register={register}
            name="profileBannerImage"
            imgData={profileBannerImage}
            cropWidth={1500}
            cropHeight={300}
            inputUI={
              <div className="z-10 flex w-full flex-col">
                <div className="relative w-full">
                  <CameraIcon className="absolute right-1 top-1 z-30 cursor-pointer" />
                  <img // eslint-disable-line @next/next/no-img-element
                    alt=""
                    className="h-[115px] w-full cursor-pointer rounded-[10px] object-cover object-center"
                    src={
                      profileBannerImage?.length
                        ? URL.createObjectURL(profileBannerImage[0])
                        : "/pages/profile/profile-cover-photo.png"
                    }
                  />
                </div>
              </div>
            }
          />

          <FormImage
            setValue={setValue}
            register={register}
            name="profileImage"
            imgData={profileImage}
            cropWidth={400}
            cropHeight={400}
            inputUI={
              <div className="relative -mt-24 ml-[26px] flex max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] items-center justify-center rounded-full bg-black  ">
                <CameraIcon className="absolute z-30 cursor-pointer" />
                <img // eslint-disable-line @next/next/no-img-element
                  alt=""
                  className="z-20 max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                  src={
                    profileImage?.length
                      ? URL.createObjectURL(profileImage[0])
                      : "/pages/profile/profile-photo.jpeg"
                  }
                />
              </div>
            }
          />
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
              name="description"
              className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              placeholder="Tell us more about yourself"
              type="text"
              errors={errors}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="text-[#b3bee7] opacity-[0.6]">
              Social Media Accounts
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileFacebookIcon className="h-[17px] w-[17px] flex-shrink-0" />
              {connectedAccounts.facebook ? (
                <span>@fbusername</span>
              ) : (
                <FormInput
                  register={register}
                  name="facebookUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
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
                  name="instagramUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
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
                  name="twitterUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
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
                  name="discordUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
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
                  name="tiktokUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
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
                  name="twitchUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-[20px] rounded-md border border-[#34343ACC] py-[10px] px-[14px]">
              <ProfileTwitchIcon className="h-[17px] w-[17px]" />
              {connectedAccounts.youtube ? (
                <span>@youtubenam</span>
              ) : (
                <FormInput
                  register={register}
                  name="youtubeUsername"
                  className="min-h-0 w-full border-none bg-black px-1 py-0.5 text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter username"
                  type="text"
                  errors={errors}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-[6px] px-12 sm:px-20">
          <FormInput
            register={register}
            type="checkbox"
            name="isAdult"
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
