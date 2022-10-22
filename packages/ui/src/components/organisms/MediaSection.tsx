import classNames from "classnames"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { FC, MouseEvent, useState } from "react"
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"
import Slider from "react-slick"
import { FormInput } from "src/components/atoms/FormInput"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_COUNT } from "src/config/media_limits"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"

import { Media, MediaFile } from "./profile/main-content/new-post/Media"

const START_SLIDER_AFTER_FILES_LENGTH = 2

const sliderSettings = {
  infinite: false,
  slidesToShow: 2,
  slidesToScroll: 1,
  nextArrow: <NextImageArrow />,
  prevArrow: <PrevImageArrow />,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

interface MediaSectionProps {
  register: UseFormRegister<any>
  errors: FieldErrorsImpl
  addNewMedia: (newFiles: File[]) => void
  files: ContentFile[]
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
}

export const MediaSection: FC<MediaSectionProps> = ({
  register,
  errors,
  addNewMedia,
  files,
  onRemove
}) => {
  const [selectedMedia, setSelectedMedia] = useState<ContentFile>()
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const onMediaFileSelect = (file: ContentFile) => {
    setSelectedMedia(file)
    setIsNewPostModalOpen(true)
  }

  const onFileInputChange = (event: any) => {
    addNewMedia([...event.target.files])
    event.target.value = ""
  }

  const onDragDropChange = (event: any) => {
    if (event?.target?.files) {
      return onFileInputChange(event)
    }
    addNewMedia([...event.target.files])
    event.target.value = ""
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
          {!!selectedMedia?.file && (
            <MediaModal
              isOpen={isNewPostModalOpen}
              setOpen={setIsNewPostModalOpen}
              file={selectedMedia}
              modalContainerClassname="p-0"
              childrenClassname="p-0"
            />
          )}
          <div className="w-100 flex items-center justify-center">
            <Slider className="max-w-[500px]" {...sliderSettings}>
              {files.map(({ file, content }, index) => (
                <>
                  {content && (
                    <div
                      key={index}
                      className="border-1 relative flex flex-shrink-0 items-center justify-center rounded-[6px] border border-[#9C4DC1] p-2 pt-3"
                    >
                      <Media
                        onRemove={(e: MouseEvent<HTMLDivElement>) =>
                          onRemove(index, e)
                        }
                        src={ContentService.userContentMediaPath(content)}
                        type={content.contentType}
                        className={classNames(
                          content.contentType.startsWith("image/")
                            ? "cursor-pointer rounded-[6px] object-contain"
                            : content.contentType.startsWith("video/")
                            ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                            : content.contentType.startsWith("aduio/")
                            ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                            : null
                        )}
                      />
                    </div>
                  )}
                  {file && (
                    <div
                      key={index}
                      className="relative left-0 flex flex-shrink-0 items-center justify-center rounded-[6px]  border border-[#9C4DC1] p-2 pt-3"
                    >
                      <MediaFile
                        onRemove={(e: MouseEvent<HTMLDivElement>) =>
                          onRemove(index, e)
                        }
                        iconClassName="bottom-[300px] left-[100px]"
                        onSelect={() => onMediaFileSelect({ file, content })}
                        file={file}
                      />
                    </div>
                  )}
                </>
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
          {/* )} */}
        </div>
      )}
    </div>
  )
}
