import { yupResolver } from "@hookform/resolvers/yup"
import { GetProfileResponseDto } from "@passes/api-client"
import ExitIcon from "public/icons/exit-icon.svg"
import CameraIcon from "public/icons/profile-camera-icon.svg"
import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, string } from "yup"

import { PassesPinkButton } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { Dialog } from "src/components/organisms/Dialog"
import { FormImage } from "src/components/organisms/FormImage"
import {
  FileAccept,
  FormLabel,
  FormPlaceholder,
  FormType
} from "src/components/types/FormTypes"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { ProfileUpdate, updateProfile } from "src/helpers/updateProfile"
import { socialMediaUsernameSchema } from "src/helpers/validation-social"
import { useProfile } from "src/hooks/profile/useProfile"
import { socialUsernames } from "./ProfileSocialMedia"

const editProfileSchema = object({
  displayName: string()
    .transform((name) => name.trim())
    .required("Please enter a display name"),
  description: string()
    .transform((name) => name.trim())
    .optional(),
  ...socialMediaUsernameSchema
})

const bioForm = {
  description: {
    type: "text-area" as FormType,
    label: "Description"
  }
}

const profilermationForm = {
  displayName: { type: "text" as FormType, label: "Display Name" }
}

const socialMediaForm = {
  discordUsername: {
    type: "text",
    label: "Discord",
    icon: Discord
  },
  facebookUsername: {
    type: "text",
    label: "Facebook",
    icon: Facebook
  },
  instagramUsername: {
    type: "text",
    label: "Instagram",
    icon: Instagram
  },
  tiktokUsername: {
    type: "text",
    label: "TikTok",
    icon: TikTok
  },
  twitchUsername: {
    type: "text",
    label: "Twitch",
    icon: Twitch
  },
  twitterUsername: {
    type: "text",
    label: "Twitter",
    icon: Twitter
  },
  youtubeUsername: {
    type: "text",
    label: "Youtube",
    icon: Youtube
  }
}

interface EditProfileProps {
  setEditProfileModalOpen: Dispatch<SetStateAction<boolean>>
  setProfileImageOverride: Dispatch<SetStateAction<string | undefined>>
}

interface RenderInputProps {
  type: FormType
  placeholder?: FormPlaceholder
  accept?: FileAccept
  label?: FormLabel
}

export const EditProfile: FC<EditProfileProps> = ({
  setEditProfileModalOpen,
  setProfileImageOverride
}) => {
  const { profile, profileUserId, mutateManualProfile } = useProfile()

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { dirtyFields, errors, isSubmitting }
  } = useForm<ProfileUpdate>({
    defaultValues: useMemo(() => {
      return {
        ...Object.fromEntries(
          ["displayName", "description", ...socialUsernames].map((k) => [
            k,
            profile?.[k as keyof GetProfileResponseDto]
          ])
        ),
        profileImage: [],
        profileBannerImage: []
      }
    }, [profile]),
    resolver: yupResolver(editProfileSchema)
  })

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  const profileImage: File[] = watch("profileImage")
  const profileBannerImage: File[] = watch("profileBannerImage")

  const renderInput = ([key, input]: [string, RenderInputProps]) => (
    <div className="col-span-6" key={key}>
      <FormInput
        register={register}
        name={key}
        className="w-full cursor-pointer rounded-md border-passes-dark-200 bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
        type={input.type}
        placeholder={input.label}
        accept={input?.accept}
        errors={errors}
      />
    </div>
  )

  const onSubmitEditProfile = async (values: Partial<ProfileUpdate>) => {
    await updateProfile(values)

    // TODO: this ends up adding on some extra properties like profile image
    mutateManualProfile(values)

    toast.success("Successfully updated your profile")

    if (values.profileImage?.[0]) {
      setProfileImageOverride(URL.createObjectURL(values.profileImage[0]))
      toast.info(
        "Please wait up to 10 minutes to see profile picture changes propogate throughout the site"
      )
    }
  }

  const onSubmit = async (values: ProfileUpdate) => {
    try {
      // Filters out non-dirty fields
      const changes = Object.fromEntries(
        Object.keys(dirtyFields).map((f) => [
          f,
          values[f as keyof ProfileUpdate]
        ])
      )

      if (changes) {
        await onSubmitEditProfile(changes)
      }
    } catch (error: unknown) {
      await errorMessage(error, true)
    } finally {
      setEditProfileModalOpen(false)
    }
  }

  return (
    <Dialog
      className="flex h-[90vh] w-screen transform flex-col items-start justify-start border border-[#ffffff]/10 bg-[#000]/60 px-[29px] pt-[37px] backdrop-blur-[100px] transition-all md:max-w-[544px] md:rounded-[15px]"
      open={true}
      onClose={() => setEditProfileModalOpen(false)}
      footer={
        <div className="left-20 mx-0 mb-6 flex cursor-pointer self-center  xs:mx-5 sm:mx-12 md:mx-0  md:-mb-4">
          <PassesPinkButton
            name="Save"
            className="flex w-full items-center justify-center self-center rounded-[50px] bg-passes-pink-100 py-[10px] text-center "
            isDisabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      }
      title={
        <div className="flex w-full flex-row justify-end py-[8px] px-[8px] xs:px-[16px] md:hidden">
          <button
            className="h-[30px] w-[30px]"
            onClick={() => setEditProfileModalOpen(false)}
          >
            <ExitIcon />
          </button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-0 py-6 xs:px-5 sm:px-12 md:py-0 md:px-0"
      >
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
                <img
                  alt=""
                  className="h-[115px] w-full cursor-pointer rounded-[15px] object-cover object-center"
                  src={
                    profileBannerImage?.length
                      ? URL.createObjectURL(profileBannerImage[0])
                      : ContentService.profileBanner(profileUserId || "")
                  }
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = "/img/profile/select-banner-img.png"
                  }}
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
            <div className="relative -mt-24 ml-[26px] flex max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] items-center justify-center rounded-full bg-black">
              <CameraIcon className="absolute z-30 cursor-pointer" />
              <img
                alt=""
                className="z-20 max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage?.length
                    ? URL.createObjectURL(profileImage[0])
                    : ContentService.profileThumbnailPath(profileUserId || "")
                }
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = "/img/profile/default-profile-img.svg"
                }}
              />
            </div>
          }
        />
        <div>
          <div>
            <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
              Bio
            </span>
            <div className="mt-3 grid w-full grid-cols-6 gap-3">
              {Object.entries(bioForm).map(renderInput)}
            </div>
          </div>
          <div className="pt-3">
            <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
              Display Name
            </span>
            <div className="mt-3 grid w-full grid-cols-6 gap-3">
              {Object.entries(profilermationForm).map(renderInput)}
            </div>
          </div>
          <div className="pt-3">
            <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
              Social Media Usernames
            </span>
            <div className="mt-3 grid w-full grid-cols-6 gap-3 pb-2">
              {Object.entries(socialMediaForm).map(([key, input]) => {
                return (
                  <div className="col-span-6" key={key}>
                    <div>
                      <div className="flex w-full items-center justify-between">
                        <FormInput
                          register={register}
                          name={key}
                          className="w-full cursor-pointer rounded-md border-passes-dark-200 bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
                          type={input.type as FormType}
                          placeholder={input.label}
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  )
}
