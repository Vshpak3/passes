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
import { dirtyValues } from "src/helpers/form"
import { ProfileUpdate, updateProfile } from "src/helpers/updateProfile"
import { displayNameSchema } from "src/helpers/validation/displayName"
import { socialMediaUsernameSchema } from "src/helpers/validation/social"
import { DeleteIcon } from "src/icons/DeleteIcon"
import { ProfileContext } from "src/pages/[username]"
import { SocialUsernames, socialUsernameToIcon } from "./ProfileSocialMedia"

const editProfileSchema = object({
  ...displayNameSchema,
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
  setProfileBannerOverride: Dispatch<SetStateAction<string | undefined>>
}

export const EditProfile: FC<EditProfileProps> = ({
  setEditProfileModalOpen,
  setProfileImageOverride,
  setProfileBannerOverride
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
        profileBanner: []
      }
    }, [profile]),
    resolver: yupResolver(editProfileSchema)
  })

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  const profileImage: File[] = watch("profileImage")
  const profileBanner: File[] = watch("profileBanner")

  const [profileImageUrl, setProfileImageUrl] = useState<string>()
  const [profileBannerUrl, setProfileBannerUrl] = useState<string>()

  const [shouldDeleteProfileBanner, setShouldDeleteProfileBanner] =
    useState(false)
  const deleteProfileBanner = () => {
    setValue("profileBanner", [])
    setProfileBannerUrl("")
    setShouldDeleteProfileBanner(true)
  }

  useEffect(() => {
    if (!profileImage?.length) {
      if (profileUserId) {
        setProfileImageUrl(ContentService.profileThumbnailPath(profileUserId))
      }
    } else {
      setProfileImageUrl(URL.createObjectURL(profileImage[0]))
    }
    if (!profileBanner?.length) {
      if (profileUserId && !shouldDeleteProfileBanner) {
        setProfileBannerUrl(ContentService.profileBanner(profileUserId))
      }
    } else {
      setProfileBannerUrl(URL.createObjectURL(profileBanner[0]))
    }
  }, [profileBanner, profileImage, profileUserId, shouldDeleteProfileBanner])

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

    if (values.profileBanner?.[0]) {
      setProfileBannerOverride(URL.createObjectURL(values.profileBanner[0]))
      toast.info(
        "Please wait up to 10 minutes to see your profile banner change throughout the site"
      )
    }
  }

  const onSubmit = async (values: ProfileUpdate) => {
    try {
      // Filters out non-dirty fields
      const changes = dirtyValues(dirtyFields, values)

      // This means if a user has no profile banner, clicks delete, and submits
      // the form it will issue an unnecessary deletion. This isn't great but it
      // is a pain to track the state here.
      if (!profileBanner?.length && shouldDeleteProfileBanner) {
        changes["deleteProfileBanner"] = true
      }

      if (Object.keys(changes).length) {
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
        <div className="relative z-10 flex w-full cursor-pointer flex-col items-center justify-center">
          <FormImage
            cropHeight={300}
            cropWidth={1500}
            imgData={profileBanner}
            inputUI={
              <div className="flex w-full select-none items-center justify-center">
                <CameraIcon
                  className={classNames("absolute z-30", {
                    hidden: !!profileBanner?.length
                  })}
                />
                <img
                  alt=""
                  className={classNames(
                    "h-[115px] w-full rounded-[15px] object-cover object-center",
                    { "opacity-30": !profileBanner?.length }
                  )}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = "/img/profile/select-banner-img.png"
                  }}
                  src={profileBannerUrl}
                />
              </div>
            }
            name="profileBanner"
            register={register}
            setValue={setValue}
          />
          <div
            className="absolute bottom-[-25px] right-0 flex items-center"
            onClick={deleteProfileBanner}
          >
            <span className="mr-2 text-xs">Delete banner image</span>
            <DeleteIcon className="h-[12px] w-[12px]" />
          </div>
        </div>
        <FormImage
          cropHeight={400}
          cropWidth={400}
          imgData={profileImage}
          inputUI={
            <div className="relative z-20 -mt-24 ml-[26px] flex max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer select-none items-center justify-center rounded-full bg-black">
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
