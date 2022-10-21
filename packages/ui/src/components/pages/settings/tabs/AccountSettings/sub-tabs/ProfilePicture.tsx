import CameraIcon from "public/icons/profile-camera-icon.svg"
import { FC, memo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
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
  const [profileImageCropOpen, setprofileImageCropOpen] = useState(false)
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
    setprofileImageCropOpen(false)
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
    <Tab
      withBack
      title="Profile Picture"
      description="Change your profile picture."
    >
      <form
        className="mt-6 flex items-center space-x-[30px]"
        onSubmit={handleSubmit(onSaveProfile)}
      >
        <FormInput
          type="file"
          register={register}
          name="profileImage"
          accept={["image"]}
          className="hidden"
          options={{
            onChange: () => setprofileImageCropOpen(true)
          }}
          trigger={
            <div className="relative flex h-[138px] w-[138px] items-center justify-center rounded-full bg-black">
              <CameraIcon className="absolute z-30 cursor-pointer" />

              {/* USE PROFILE IMAGE INSTEAD <ProfileImage userId={userId} /> */}
              <img
                alt=""
                className="z-20 h-[138px] w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage.length
                    ? URL.createObjectURL(profileImage[0])
                    : ContentService.profileThumbnail(user?.userId || "")
                }
              />
            </div>
          }
        />
        {profileImageCropOpen && !!profileImage.length && (
          <ImageCropDialog
            onCrop={onProfileCrop}
            onClose={() => setprofileImageCropOpen(false)}
            width={400}
            height={400}
            src={URL.createObjectURL(profileImage[0])}
          />
        )}
        <Button
          variant="pink"
          className="w-auto !px-[52px]"
          tag="button"
          disabled={
            !profileImage?.length ||
            profileImage === lastSubmittedProfPic ||
            isSubmitting
          }
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(ProfilePicture) // eslint-disable-line import/no-default-export
