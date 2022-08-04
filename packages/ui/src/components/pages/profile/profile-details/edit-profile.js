import React from "react"
import { useForm } from "react-hook-form"
import { Dialog } from "src/components/common/dialog"
import { FormInput } from "src/components/form/form-input"

const form = {
  fullName: { type: "text", label: "Full Name" },
  userId: { type: "text", label: "Username" },
  description: { type: "text-area", label: "Description" },
  coverDescription: { type: "text-area", label: "Cover Description" },
  coverTitle: { type: "text", label: "Cover Title" },
  instagramUrl: { type: "text", label: "Instagram" },
  tiktokUrl: { type: "text", label: "TikTok" },
  youtubeUrl: { type: "text", label: "Youtube" },
  discordUrl: { type: "text", label: "Discord" },
  twitchUrl: { type: "text", label: "Twitch" },
  facebookUrl: { type: "text", label: "Facebook" },
  twitterUrl: { type: "text", label: "Twitter" }
}

export const EditProfile = ({ profile, onSubmit, onCloseEditProfile }) => {
  const { handleSubmit, register, getValues, watch } = useForm({
    defaultValues: profile
  })

  const profileImage = watch("profileImage")
  const profileImageUrl = watch("profileImageUrl")
  const profileCoverImage = watch("profileCoverImage")
  const profileCoverImageUrl = watch("profileCoverImageUrl")

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-5"
    >
      <Dialog
        className="min-h-12 flex h-screen w-screen transform flex-col items-start justify-start border border-[#ffffff]/10 bg-[#1b141d]/80 p-5 backdrop-blur-[100px] transition-all md:max-h-[580px] md:max-w-[580px] md:rounded-[20px] lg:max-w-[680px]"
        open={true}
        title={
          <div className="flex w-full items-center justify-between pb-2">
            <span className="cursor-pointer">
              <button
                type="button"
                onClick={onCloseEditProfile}
                className="flex cursor-pointer items-center justify-start pt-1 text-base text-[#bf7af0] hover:underline"
              >
                Cancel
              </button>
            </span>
            <span className="font-bold">Edit Profile</span>
            <span className="cursor-pointer">
              <button
                onClick={handleSubmit(() => onSubmit(getValues()))}
                className="flex cursor-pointer items-center justify-start pt-1 text-base text-[#bf7af0] hover:underline"
              >
                Done
              </button>
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
            <div className="flex w-full flex-col items-center justify-center gap-2 pb-5">
              <div className="flex max-h-[134px] w-full">
                <img // eslint-disable-line @next/next/no-img-element
                  alt=""
                  layout="fill"
                  className="w-full cursor-pointer rounded-[20px] object-cover object-center"
                  src={
                    profileCoverImage?.length
                      ? URL.createObjectURL(profileCoverImage[0])
                      : profileCoverImageUrl
                  }
                />
              </div>
              <span>
                <button
                  type="button"
                  className=" flex cursor-pointer items-center justify-start pt-1 text-base text-[#bf7af0] hover:underline"
                >
                  Change Cover Photo..
                </button>
              </span>
            </div>
          }
        />

        <FormInput
          type="file"
          register={register}
          name="profileImage"
          accept={["image"]}
          trigger={
            <div className="flex w-full flex-col items-center justify-center gap-2 pb-5">
              <span>
                <img // eslint-disable-line @next/next/no-img-element
                  alt=""
                  layout="fill"
                  className="max-h-[98px] min-h-[98px] min-w-[98px] max-w-[98px] cursor-pointer rounded-full border border-black object-cover drop-shadow-profile-photo"
                  src={
                    profileImage?.length
                      ? URL.createObjectURL(profileImage[0])
                      : profileImageUrl
                  }
                />
              </span>
              <span>
                <button
                  type="button"
                  className=" flex cursor-pointer items-center justify-start pt-1 text-base text-[#bf7af0] hover:underline"
                >
                  Change Profile Photo..
                </button>
              </span>
            </div>
          }
        />
        <div className="grid w-full grid-cols-2 gap-5">
          {Object.entries(form).map(([key, input]) => (
            <div className="col-span-2 text-start md:col-span-1" key={key}>
              <FormInput
                register={register}
                name={key}
                label={input.label}
                className="w-full cursor-pointer rounded-md border-[#2C282D] bg-[#100C11]/50 py-[10px] text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0"
                type={input.type}
                accept={input?.accept}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </form>
  )
}
