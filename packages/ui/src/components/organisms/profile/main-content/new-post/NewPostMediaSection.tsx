import classNames from "classnames"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react"
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"
import Slider from "react-slick"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms/FormInput"
import { NewPostMediaModal } from "src/components/organisms/NewPostMediaModal"
import {
  ACCEPTED_MEDIA_TYPES,
  MAX_FILE_COUNT,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_NAME,
  MAX_VIDEO_SIZE,
  MAX_VIDEO_SIZE_NAME
} from "src/config/post"

import { MediaFile } from "./Media"
import { NewPostFormProps } from "./NewPostEditor"

const START_SLIDER_AFTER_FILES_LENGTH = 2

const sliderSettings = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextImageArrow />,
  prevArrow: <PrevImageArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
}

interface NewPostMediaSectionProps {
  register: UseFormRegister<NewPostFormProps>
  errors: FieldErrorsImpl
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
}

export const NewPostMediaSection: FC<NewPostMediaSectionProps> = ({
  register,
  errors,
  files,
  setFiles
}) => {
  const [selectedMedia, setSelectedMedia] = useState<File>()
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const onMediaFileSelect = (file: File) => {
    setSelectedMedia(file)
    setIsNewPostModalOpen(true)
  }

  const onFileInputChange = (event: any) => {
    onMediaChange([...event.target.files])
    event.target.value = ""
  }

  const onDragDropChange = (event: any) => {
    if (event?.target?.files) {
      return onFileInputChange(event)
    }
    onMediaChange([...event.target.files])
    event.target.value = ""
  }

  const onRemove = (index: number, e: MouseEvent<HTMLDivElement>) => {
    const newFiles = files.filter((_, i) => i !== index)
    e.stopPropagation()
    setFiles(newFiles)
  }

  const onMediaChange = (fileProps: File[]) => {
    // Validate properties of each file
    for (const file of fileProps) {
      const type = file.type.match(/(\w+)\/(\w+)/)?.at(1)
      if (!type || (type !== "image" && type !== "video")) {
        toast.error(`Invalid media type ${file.type}`)
        return
      }

      if (fileProps.length + files.length > MAX_FILE_COUNT) {
        toast.error(
          `Can only have a maximum of ${MAX_FILE_COUNT} pictures/videos`
        )
        return
      }

      if (type === "video" && file.size > MAX_VIDEO_SIZE) {
        toast.error(`Videos cannot be larger than ${MAX_VIDEO_SIZE_NAME}`)
        return
      }

      if (type === "image" && file.size > MAX_IMAGE_SIZE) {
        toast.error(`Images cannot be larger than ${MAX_IMAGE_SIZE_NAME}`)
        return
      }
    }

    setFiles([...files, ...fileProps])
  }

  return (
    <div className="h-full w-full items-center overflow-y-auto pt-5">
      {files.length === 0 ? (
        <FormInput
          className="h-[170px]"
          register={register}
          name={"drag-drop"}
          type="drag-drop-file"
          multiple={true}
          accept={["image", "video"]}
          options={{ onChange: onDragDropChange }}
          errors={errors}
          helperText={`You may upload up to ${MAX_FILE_COUNT} pictures/videos per post`}
        />
      ) : (
        <div
          className={classNames({
            flex: files.length <= START_SLIDER_AFTER_FILES_LENGTH,
            "w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1 sm:border-passes-secondary-color md:h-fit md:p-9":
              true
          })}
        >
          {selectedMedia && (
            <NewPostMediaModal
              isOpen={isNewPostModalOpen}
              setOpen={setIsNewPostModalOpen}
              file={selectedMedia}
              modalContainerClassname="p-0"
              childrenClassname="p-0"
            />
          )}
          {files.length <= START_SLIDER_AFTER_FILES_LENGTH ? (
            <div className="flex items-center justify-start gap-[7px]">
              <div className="flex flex-nowrap items-center gap-[7px] overflow-x-auto sm:max-w-fit">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={classNames(
                      (file as File).type.startsWith("image/")
                        ? "h-[200px] w-[130px] rounded-[6px] object-contain"
                        : (file as any).type.startsWith("video/")
                        ? "absolute inset-0 m-auto h-[334px] max-h-full min-h-full w-[250px] min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                        : (file as any).type.startsWith("audio/")
                        ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                        : "",
                      "relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px]"
                    )}
                  >
                    <MediaFile
                      onRemove={(e: MouseEvent<HTMLDivElement>) =>
                        onRemove(index, e)
                      }
                      onSelect={() => onMediaFileSelect(file)}
                      file={file}
                      iconClassName="bottom-[230px] left-[190px]"
                      className={classNames(
                        (file as File).type.startsWith("image/")
                          ? "rounded-[6px] object-contain"
                          : (file as any).type.startsWith("video/")
                          ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                          : (file as any).type.startsWith("audio/")
                          ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                          : ""
                      )}
                    />
                  </div>
                ))}
              </div>
              {files.length !== MAX_FILE_COUNT && (
                <FormInput
                  register={register}
                  name="drag-drop"
                  type="file"
                  multiple={true}
                  trigger={
                    <div className="box-border flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[50%] border border-passes-secondary-color bg-transparent">
                      <PlusIcon />
                    </div>
                  }
                  options={{ onChange: onFileInputChange }}
                  accept={ACCEPTED_MEDIA_TYPES}
                  errors={errors}
                />
              )}
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <Slider
                className="w-[320px] sm:min-w-[400px]"
                {...sliderSettings}
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative left-0 flex h-[200px] max-w-[130px] flex-shrink-0 items-center overflow-hidden rounded-[6px]"
                  >
                    <MediaFile
                      onRemove={(e: MouseEvent<HTMLDivElement>) =>
                        onRemove(index, e)
                      }
                      iconClassName="bottom-[300px] left-[100px]"
                      onSelect={() => onMediaFileSelect(file)}
                      file={file}
                    />
                  </div>
                ))}
                <div className="absolute top-[50%] ml-[15px] translate-y-[-50%]">
                  {files.length !== MAX_FILE_COUNT && (
                    <FormInput
                      register={register}
                      name="drag-drop"
                      type="file"
                      multiple={true}
                      trigger={
                        <div className="box-border flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[50%] border border-passes-secondary-color bg-transparent">
                          <PlusIcon />
                        </div>
                      }
                      options={{ onChange: onFileInputChange }}
                      accept={ACCEPTED_MEDIA_TYPES}
                      errors={errors}
                    />
                  )}
                </div>
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
