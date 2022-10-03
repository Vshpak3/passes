import CameraIcon from "public/icons/profile-camera-icon.svg"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { ImageCropDialog } from "src/components/organisms/ImageCropDialog"
import Tab from "src/components/pages/settings/Tab"
import { useAccountSettings } from "src/hooks"

interface IProfileForm {
  profileImage: File[] | null
}

const ProfilePicture = () => {
  const { setProfilePicture, getProfileUrl } = useAccountSettings()
  const [profileImageCropOpen, setprofileImageCropOpen] = useState(false)
  const { register, watch, setValue, handleSubmit } = useForm<IProfileForm>()

  const profileImage = watch("profileImage")

  const onProfileCrop = (croppedImage: any) => {
    setValue("profileImage", [croppedImage], { shouldValidate: true })
    setprofileImageCropOpen(false)
  }

  const onSaveProfile = async () => {
    if (!profileImage || !profileImage.length) {
      return
    }
    await setProfilePicture(profileImage[0])
    setValue("profileImage", null)
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
              <img
                alt=""
                className="z-20 h-[138px] w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage?.length
                    ? URL.createObjectURL(profileImage[0])
                    : getProfileUrl()
                }
              />
            </div>
          }
        />
        {profileImageCropOpen && profileImage?.length && (
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
          disabled={!profileImage || !profileImage.length}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default ProfilePicture
