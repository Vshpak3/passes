import CameraIcon from "public/icons/profile-camera-icon.svg"
import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import React from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Dialog } from "src/components/organisms"
import FormImage from "src/components/organisms/FormImage"
import { FormType } from "src/components/types/FormTypes"

const bioForm = {
  description: {
    type: "text-area",
    label: "Description",
    colSpan: "col-span-6"
  }
}

const profileInformationForm = {
  displayName: { type: "text", label: "Display Name", colSpan: "col-span-6" }
}

const socialMediaForm = {
  discordUsername: {
    type: "text",
    label: "Discord",
    colSpan: "col-span-6",
    icon: Discord
  },
  facebookUsername: {
    type: "text",
    label: "Facebook",
    colSpan: "col-span-6",
    icon: Facebook
  },
  instagramUsername: {
    type: "text",
    label: "Instagram",
    colSpan: "col-span-6",
    icon: Instagram
  },
  tiktokUsername: {
    type: "text",
    label: "TikTok",
    colSpan: "col-span-6",
    icon: TikTok
  },
  twitchUsername: {
    type: "text",
    label: "Twitch",
    colSpan: "col-span-6",
    icon: Twitch
  },
  twitterUsername: {
    type: "text",
    label: "Twitter",
    colSpan: "col-span-6",
    icon: Twitter
  },
  youtubeUsername: {
    type: "text",
    label: "Youtube",
    colSpan: "col-span-6",
    icon: Youtube
  }
}
export const EditProfile = ({ profile, onSubmit, onCloseEditProfile }: any) => {
  const { handleSubmit, register, getValues, watch, setValue } = useForm({
    defaultValues: profile
  })

  const profileImage = watch("profileImage")
  const profileCoverImage = watch("profileCoverImage")
  const renderInput = ([key, input]: any) => (
    <div className={input.colSpan} key={key}>
      <FormInput
        register={register}
        name={key}
        className="w-full cursor-pointer rounded-md border-passes-dark-200 bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
        type={input.type}
        placeholder={input.label}
        accept={input?.accept}
      />
    </div>
  )

  return (
    <>
      <Dialog
        className="flex h-[90vh] w-screen transform flex-col items-start justify-start border border-[#ffffff]/10 bg-[#000]/60 px-[29px] pt-[37px] backdrop-blur-[100px] transition-all md:max-w-[544px] md:rounded-[20px]"
        open={true}
        onClose={onCloseEditProfile}
        footer={
          <div className="left-20 -mb-4 flex cursor-pointer self-center ">
            <span
              className="flex w-full items-center justify-center self-center rounded-[50px] bg-passes-pink-100 py-[10px] text-center "
              onClick={handleSubmit(() => onSubmit(getValues()))}
            >
              Confirm and Continue
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col  items-center gap-5"
        >
          <FormImage
            setValue={setValue}
            register={register}
            name="profileCoverImage"
            imgData={profileCoverImage}
            cropWidth={1500}
            cropHeight={300}
            inputUI={
              <div className="z-10 flex w-full flex-col">
                <div className="relative w-full">
                  <CameraIcon className="absolute right-1 top-1 z-30 cursor-pointer" />
                  <img
                    alt=""
                    className="h-[115px] w-full cursor-pointer rounded-[10px] object-cover object-center"
                    src={
                      profileCoverImage?.length
                        ? URL.createObjectURL(profileCoverImage[0])
                        : "/img/default-banner-img.png"
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
                <img
                  alt=""
                  className="z-20 max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                  src={
                    profileImage?.length
                      ? URL.createObjectURL(profileImage[0])
                      : "/img/default-profile-img.png"
                  }
                />
              </div>
            }
          />
          <div>
            <div>
              <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
                Bio
              </span>
              <div className="grid w-full grid-cols-6 gap-3">
                {Object.entries(bioForm).map(renderInput)}
              </div>
            </div>
            <div className="pt-3">
              <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
                Display Name
              </span>
              <div className="grid w-full grid-cols-6 gap-3">
                {Object.entries(profileInformationForm).map(renderInput)}
              </div>
            </div>
            <div className="pt-3">
              <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
                Social Media (username)
              </span>
              <div className="grid w-full grid-cols-6 gap-3 pb-2 ">
                {Object.entries(socialMediaForm).map(([key, input]) => {
                  return (
                    <div className={input.colSpan} key={key}>
                      <div>
                        <div className=" flex w-full items-center justify-between pl-[18px]">
                          <FormInput
                            register={register}
                            name={key}
                            className="w-full cursor-pointer rounded-md border-passes-dark-200 bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
                            type={input.type as FormType}
                            placeholder={input.label}
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
    </>
  )
}
