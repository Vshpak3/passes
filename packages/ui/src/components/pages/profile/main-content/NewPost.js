import CalendarIcon from "public/icons/profile-calendar-icon.svg"
import PhotosIcon1 from "public/icons/profile-photos1-icon.svg"
import VideoIcon from "public/icons/profile-video-icon.svg"
import React from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/form/form-input"

export const NewPost = () => {
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {}
  })

  const onSubmit = () => {
    const values = getValues()
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 px-7 py-5 backdrop-blur-[100px]">
        <FormInput
          register={register}
          type="text-area"
          name="text"
          className="m-0 w-full resize-none border-transparent bg-transparent p-0 focus:border-transparent focus:ring-0"
          placeholder="What’s on your mind?"
          rows={4}
          cols={40}
        />

        <div className="flex items-center gap-6">
          <FormInput
            register={register}
            type="file"
            name="photos"
            accept={["image"]}
            multiple={true}
            trigger={
              <div className="flex cursor-pointer items-center">
                <span>
                  <PhotosIcon1 className="bg-transparent" />
                </span>
                <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
                  Photos
                </span>
              </div>
            }
          />
          <FormInput
            register={register}
            type="file"
            name="video"
            accept={["video"]}
            trigger={
              <div className="flex cursor-pointer items-center">
                <span>
                  <VideoIcon className="bg-transparent" />
                </span>
                <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
                  Video
                </span>
              </div>
            }
          />
          <FormInput
            register={register}
            type="file"
            name="calendar"
            accept={["image"]}
            trigger={
              <div className="flex cursor-pointer items-center">
                <span>
                  <CalendarIcon className="bg-transparent" />
                </span>
                <span className="pl-2 text-center text-[14px] leading-[17px] text-[#BF7AF0]">
                  Schedule a post
                </span>
              </div>
            }
          />
        </div>
      </div>
    </form>
  )
}
