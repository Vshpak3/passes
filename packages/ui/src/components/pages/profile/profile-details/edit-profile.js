import CameraIcon from "public/icons/profile-camera-icon.svg"
import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Dialog } from "src/components/organisms"
const bioForm = {
  coverDescription: {
    type: "text-area",
    label: "Cover Description",
    colSpan: "col-span-6"
  }
}

const profileInformationForm = {
  userId: { type: "text", label: "Username", colSpan: "col-span-6" },
  firstName: { type: "text", label: "First Name", colSpan: "col-span-3" },
  lastName: { type: "text", label: "Last Name", colSpan: "col-span-3" },
  location: { type: "text", label: "Location", colSpan: "col-span-6" },
  website: { type: "text", label: "Website", colSpan: "col-span-6" }
}

const birthInformationForm = {
  dayOfBirth: { type: "text", label: "Day", colSpan: "col-span-2" },
  monthOfBirth: { type: "text", label: "Month", colSpan: "col-span-2" },
  yearOfBirth: { type: "text", label: "Year", colSpan: "col-span-2" }
}

const socialMediaForm = {
  instagramUrl: {
    type: "text",
    label: "Instagram",
    colSpan: "col-span-6",
    icon: Instagram
  },
  tiktokUrl: {
    type: "text",
    label: "TikTok",
    colSpan: "col-span-6",
    icon: TikTok
  },
  youtubeUrl: {
    type: "text",
    label: "Youtube",
    colSpan: "col-span-6",
    icon: Youtube
  },
  discordUrl: {
    type: "text",
    label: "Discord",
    colSpan: "col-span-6",
    icon: Discord
  },
  twitchUrl: {
    type: "text",
    label: "Twitch",
    colSpan: "col-span-6",
    icon: Twitch
  },
  facebookUrl: {
    type: "text",
    label: "Facebook",
    colSpan: "col-span-6",
    icon: Facebook
  },
  twitterUrl: {
    type: "text",
    label: "Twitter",
    colSpan: "col-span-6",
    icon: Twitter
  }
}
export const EditProfile = ({ profile, onSubmit }) => {
  const { handleSubmit, register, getValues, watch, setValue } = useForm({
    defaultValues: profile
  })
  const [enableInput, setEnableInput] = useState(false)
  const onDisconnectSocialMedia = (key) => {
    setValue(key, "", { shouldDirty: true })
  }

  const profileImage = watch("profileImage")
  const profileImageUrl = watch("profileImageUrl")
  const profileCoverImage = watch("profileCoverImage")
  const profileCoverImageUrl = watch("profileCoverImageUrl")

  const fields = watch()

  const onChangeSocialMedia = (event, key) => {
    setValue(key, event.target.value, { shouldValidate: true })
  }

  const renderInput = ([key, input]) => (
    <div className={input.colSpan} key={key}>
      <FormInput
        register={register}
        name={key}
        className="w-full cursor-pointer rounded-md border-[#2C282D] bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0"
        type={input.type}
        placeholder={input.label}
        accept={input?.accept}
      />
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col  items-center gap-5"
    >
      <Dialog
        className="flex h-[90vh] w-screen transform flex-col items-start justify-start border border-[#ffffff]/10 bg-[#000]/60 px-[29px] pt-[37px] backdrop-blur-[100px] transition-all md:max-w-[544px] md:rounded-[20px]"
        open={true}
        footer={
          <div className="left-20 -mb-4 flex cursor-pointer self-center ">
            <span
              className="flex w-full items-center justify-center self-center rounded-[50px] bg-[#C943A8] py-[10px] text-center "
              onClick={handleSubmit(() => onSubmit(getValues()))}
            >
              Confirm and Continue
            </span>
          </div>
        }
      >
        <FormInput
          type="file"
          register={register}
          name="profileCoverImage"
          accept={["image"]}
          trigger={
            <div className="z-10 flex w-full flex-col">
              <div className="relative w-full">
                <CameraIcon className="absolute right-1 top-1 z-30 cursor-pointer" />
                <img // eslint-disable-line @next/next/no-img-element
                  alt=""
                  layout="fill"
                  className="h-[115px] w-full cursor-pointer rounded-[10px] object-cover object-center"
                  src={
                    profileCoverImage?.length
                      ? URL.createObjectURL(profileCoverImage[0])
                      : profileCoverImageUrl
                  }
                />
              </div>
            </div>
          }
        />
        <FormInput
          type="file"
          register={register}
          name="profileImage"
          accept={["image"]}
          className="hidden"
          trigger={
            <div className="relative -mt-24 ml-[26px] flex max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] items-center justify-center rounded-full bg-black  ">
              <CameraIcon className="absolute z-30 cursor-pointer" />
              <img // eslint-disable-line @next/next/no-img-element
                alt=""
                className="z-20 max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] cursor-pointer rounded-full border-transparent object-cover opacity-30 drop-shadow-profile-photo"
                src={
                  profileImage?.length
                    ? URL.createObjectURL(profileImage[0])
                    : profileImageUrl
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
              Profile Information
            </span>
            <div className="grid w-full grid-cols-6 gap-3">
              {Object.entries(profileInformationForm).map(renderInput)}
            </div>
          </div>
          <div className="pt-3">
            <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
              Date of birth
            </span>
            <div className="grid w-full grid-cols-6 gap-3">
              {Object.entries(birthInformationForm).map(([key, input]) => (
                <div className={input.colSpan} key={key}>
                  <FormInput
                    register={register}
                    name={key}
                    className="w-full cursor-pointer rounded-md border-[#2C282D] bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0"
                    type={input.type}
                    placeholder={input.label}
                    accept={input?.accept}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3">
            <span className="flex items-center justify-start text-[18px] font-bold leading-[25px] text-white">
              Social Media
            </span>
            <div className="grid w-full grid-cols-6 gap-3 pb-2 ">
              {Object.entries(socialMediaForm).map(([key, input]) => {
                return (
                  <div className={input.colSpan} key={key}>
                    {fields[key] ? (
                      <div className="flex w-full items-center pt-2">
                        <input.icon className="h-[20px] w-[20px]" />
                        <div className="flex w-full justify-between">
                          <span className="pl-5 text-[16px] font-medium leading-[22px] text-white">
                            {fields[key]}
                          </span>
                          <span
                            className="float-right cursor-pointer text-end text-[16px] font-medium leading-[22px] text-[#C943A8] hover:underline"
                            onClick={() => onDisconnectSocialMedia(key)}
                          >
                            Disconnect
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!fields[key] && (
                          <div className="flex items-center justify-start pt-2">
                            <input.icon className="h-[20px] w-[20px]" />
                            {!enableInput ? (
                              <span
                                className="cursor-pointer pl-5 text-[16px] font-medium leading-[22px] text-white hover:underline "
                                onClick={() => setEnableInput(true)}
                                htmlFor={key}
                              >
                                Connect
                              </span>
                            ) : (
                              <div className=" flex w-full items-center justify-between pl-[18px]">
                                <FormInput
                                  register={register}
                                  name={key}
                                  className="w-full cursor-pointer rounded-md border-[#2C282D] bg-[#100C11]/50 text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0"
                                  type={input.type}
                                  onChange={() => {
                                    return null
                                  }}
                                  // overwrite default onChange
                                  options={{
                                    onBlur: (e) => onChangeSocialMedia(e, key)
                                  }}
                                  placeholder={input.label}
                                />

                                <span
                                  className="cursor-pointer pl-5 text-[16px] font-medium leading-[22px] text-[#C943A8] hover:underline "
                                  onClick={() => setEnableInput(false)}
                                >
                                  Connect
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Dialog>
    </form>
  )
}
