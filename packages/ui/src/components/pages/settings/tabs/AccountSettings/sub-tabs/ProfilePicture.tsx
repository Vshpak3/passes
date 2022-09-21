import CameraIcon from "public/icons/profile-camera-icon.svg"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { ImageCropDialog } from "src/components/organisms/ImageCropDialog"

import Tab from "../../../Tab"

let profileImageUrl = "/pages/profile/profile-photo.jpeg"

interface IProfileForm {
  profileImage: File[] | null
}

const ProfilePicture = () => {
  const [profileImageCropOpen, setProfileImageCropOpen] = useState(false)
  const { register, watch, setValue, handleSubmit } = useForm<IProfileForm>()

  const profileImage = watch("profileImage")

  const onProfileCrop = (croppedImage: any) => {
    setValue("profileImage", [croppedImage], { shouldValidate: true })
    setProfileImageCropOpen(false)
  }

  const onSaveProfile = async () => {
    if (profileImage) {
      setValue("profileImage", null)
      profileImageUrl = URL.createObjectURL(profileImage[0])
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
          options={{ onChange: () => setProfileImageCropOpen(true) }}
          trigger={
            <div className="relative flex h-[138px] w-[138px] items-center justify-center rounded-full bg-black">
              <CameraIcon className="absolute z-30 cursor-pointer" />
              <img // eslint-disable-line @next/next/no-img-element
                alt=""
                className="z-20 h-[138px] w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage?.length
                    ? URL.createObjectURL(profileImage[0])
                    : profileImageUrl
                }
              />
            </div>
          }
        />
        {profileImageCropOpen && profileImage?.length && (
          <ImageCropDialog
            onCrop={onProfileCrop}
            onClose={() => setProfileImageCropOpen(false)}
            width={400}
            height={400}
            src={URL.createObjectURL(profileImage[0])}
          />
        )}
        <Button
          variant="pink"
          className="w-auto !px-[52px]"
          tag="button"
          disabled={!profileImage}
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
