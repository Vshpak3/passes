import CameraIcon from "public/icons/profile-camera-icon.svg"
import { FC, memo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { FileInput } from "src/components/atoms/input/FileInput"
import { ImageCropDialog } from "src/components/organisms/ImageCropDialog"
import { Tab } from "src/components/pages/settings/Tab"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"

interface ProfileFormProps {
  profileImage: File[]
}

const ProfilePicture: FC = () => {
  const { user } = useUser()
  const [profileImageCropOpen, setProfileImageCropOpen] = useState(false)
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ProfileFormProps>({
    defaultValues: { profileImage: [] }
  })
  const [lastSubmittedProfPic, setLastSubmittedProfPic] = useState<File[]>()

  const profileImage = watch("profileImage")

  const setProfilePicture = async (picture: File) => {
    return await new ContentService().uploadProfileImage(picture)
  }

  const onProfileCrop = (croppedImage: File) => {
    setValue("profileImage", [croppedImage], { shouldValidate: true })
    setProfileImageCropOpen(false)
  }

  const onSaveProfile = async () => {
    if (!profileImage.length) {
      toast.error("Please upload a profile image")
      return
    }

    try {
      await setProfilePicture(profileImage[0])
      toast.info(
        "Please wait up to 10 minutes to see profile picture changes propogate throughout the site"
      )
      // Ensure we show the new profile image
      // setValue("profileImage", [])
      setLastSubmittedProfPic(profileImage)
    } catch (error) {
      errorMessage(error, true)
    }
  }

  return (
    <Tab description="Change your profile picture." title="Profile Picture">
      <form
        className="mt-6 flex items-center space-x-[30px]"
        onSubmit={handleSubmit(onSaveProfile)}
      >
        <FileInput
          accept={["image"]}
          className="hidden"
          name="profileImage"
          options={{
            onChange: () => setProfileImageCropOpen(true)
          }}
          register={register}
          trigger={
            <div className="relative flex h-[138px] w-[138px] items-center justify-center rounded-full bg-black">
              <CameraIcon className="absolute z-30 cursor-pointer" />
              <img
                alt=""
                className="z-20 h-[138px] w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage.length
                    ? URL.createObjectURL(profileImage[0])
                    : ContentService.profileThumbnailPath(user?.userId || "")
                }
              />
            </div>
          }
        />
        {profileImageCropOpen && !!profileImage.length && (
          <ImageCropDialog
            height={400}
            onClose={() => setProfileImageCropOpen(false)}
            onCrop={onProfileCrop}
            src={URL.createObjectURL(profileImage[0])}
            width={400}
          />
        )}
        <Button
          className="w-auto !px-[52px]"
          disabled={
            !profileImage?.length ||
            profileImage === lastSubmittedProfPic ||
            isSubmitting
          }
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(ProfilePicture) // eslint-disable-line import/no-default-export
