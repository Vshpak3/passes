import { yupResolver } from "@hookform/resolvers/yup"
import { GetProfileResponseDto } from "@passes/api-client"
import classNames from "classnames"
import ExitIcon from "public/icons/exit-icon.svg"
import CameraIcon from "public/icons/profile-camera-icon.svg"
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, string } from "yup"

import { Button } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { FormLabel } from "src/components/atoms/input/InputTypes"
import { TextAreaInput } from "src/components/atoms/input/TextAreaInput"
import { Dialog } from "src/components/organisms/Dialog"
import { FormImage } from "src/components/organisms/FormImage"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { ProfileUpdate, updateProfile } from "src/helpers/updateProfile"
import { socialMediaUsernameSchema } from "src/helpers/validation-social"
import { ProfileContext } from "src/pages/[username]"
import { SocialUsernames, socialUsernameToIcon } from "./ProfileSocialMedia"

const editProfileSchema = object({
  displayName: string()
    .transform((name) => name.trim())
    .required("Please enter a display name"),
  description: string()
    .transform((name) => name.trim())
    .optional(),
  ...socialMediaUsernameSchema
})

interface RenderInputProps {
  type: typeof Input | typeof TextAreaInput
  placeholder: FormLabel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
}

const bioForm: Record<string, RenderInputProps> = {
  description: {
    type: TextAreaInput,
    placeholder: "Description"
  }
}

const profilermationForm: Record<string, RenderInputProps> = {
  displayName: { type: Input, placeholder: "Display Name" }
}

const socialMediaForm: Record<string, RenderInputProps> = Object.fromEntries(
  Object.entries(socialUsernameToIcon).map(([type, icon]) => [
    type,
    {
      type: Input,
      placeholder:
        type.charAt(0).toUpperCase() + type.slice(1).replace("Username", ""),
      icon
    }
  ])
)

interface EditProfileProps {
  setEditProfileModalOpen: Dispatch<SetStateAction<boolean>>
  setProfileImageOverride: Dispatch<SetStateAction<string | undefined>>
  setProfileBannerImageOverride: Dispatch<SetStateAction<string | undefined>>
}

export const EditProfile: FC<EditProfileProps> = ({
  setEditProfileModalOpen,
  setProfileImageOverride,
  setProfileBannerImageOverride
}) => {
  const { profile, profileUserId, mutateManualProfile } =
    useContext(ProfileContext)

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
          ["displayName", "description", ...Object.keys(SocialUsernames)].map(
            (k) => [k, profile?.[k as keyof GetProfileResponseDto]]
          )
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

  const [profileImageUrl, setProfileImageUrl] = useState<string>()
  const [profileBannerImageUrl, setProfileBannerImageUrl] = useState<string>()

  useEffect(() => {
    if (!profileImage?.length) {
      if (profileUserId) {
        setProfileImageUrl(ContentService.profileThumbnailPath(profileUserId))
      }
    } else {
      setProfileImageUrl(URL.createObjectURL(profileImage[0]))
    }
    if (!profileBannerImage?.length) {
      if (profileUserId) {
        setProfileBannerImageUrl(ContentService.profileBanner(profileUserId))
      }
    } else {
      setProfileBannerImageUrl(URL.createObjectURL(profileBannerImage[0]))
    }
  }, [profileBannerImage, profileImage, profileUserId])

  const renderInput = ([key, input]: [string, RenderInputProps]) => (
    <div className="col-span-6 flex items-center" key={key}>
      {!!input?.icon && <input.icon className="mr-3" />}
      <input.type
        className="w-full cursor-pointer rounded-md border-passes-dark-200 bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
        errors={errors}
        name={key}
        placeholder={input.placeholder}
        register={register}
        type="text"
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
        "Please wait up to 10 minutes to see your profile picture change throughout the site"
      )
    }
    if (values.profileBannerImage?.[0]) {
      setProfileBannerImageOverride(
        URL.createObjectURL(values.profileBannerImage[0])
      )
      toast.info(
        "Please wait up to 10 minutes to see your profile banner change throughout the site"
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
      className="flex h-[90vh] w-screen flex-col items-start justify-start border border-[#ffffff]/10 bg-[#000]/60 px-[29px] pt-[37px] backdrop-blur-[100px] transition-all md:max-w-[544px] md:rounded-[15px]"
      footer={
        <div className="left-20 mx-0 my-5 flex cursor-pointer self-center xs:mx-5 sm:mx-12 md:mx-0">
          <Button
            className="flex w-full items-center justify-center self-center text-center"
            disabled={isSubmitting}
            fontSize={16}
            onClick={handleSubmit(onSubmit)}
          >
            Save Profile
          </Button>
        </div>
      }
      onClose={() => setEditProfileModalOpen(false)}
      open
      title={
        <div className="flex w-full flex-row justify-end p-[8px] xs:px-[16px] md:hidden">
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
        className="flex flex-col gap-5 px-0 py-6 xs:px-5 sm:px-12 md:p-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormImage
          cropHeight={300}
          cropWidth={1500}
          imgData={profileBannerImage}
          inputUI={
            <div className="relative z-10 flex w-full cursor-pointer flex-col items-center justify-center">
              <CameraIcon
                className={classNames("absolute z-30", {
                  hidden: !!profileBannerImage?.length
                })}
              />
              <img
                alt=""
                className={classNames(
                  "h-[115px] w-full rounded-[15px] object-cover object-center",
                  { "opacity-30": !profileBannerImage?.length }
                )}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = "/img/profile/select-banner-img.png"
                }}
                src={profileBannerImageUrl}
              />
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
            <div className="relative z-20 -mt-24 ml-[26px] flex max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer items-center justify-center rounded-full bg-black">
              <CameraIcon
                className={classNames("absolute z-30", {
                  hidden: !!profileImage?.length
                })}
              />
              <img
                alt=""
                className={classNames(
                  "z-20 max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] rounded-full border-transparent object-cover",
                  { "opacity-30": !profileImage?.length }
                )}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = "/img/profile/default-profile-img.svg"
                }}
                src={profileImageUrl}
              />
            </div>
          }
          name="profileImage"
          register={register}
          setValue={setValue}
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
              {Object.entries(socialMediaForm).map(renderInput)}
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  )
}
