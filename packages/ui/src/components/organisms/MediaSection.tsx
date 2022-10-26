// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import classNames from "classnames"
import PlusIcon from "public/icons/post-plus-icon.svg"
import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react"
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"
import { Navigation } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

import { FormInput } from "src/components/atoms/FormInput"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { Media, MediaFile } from "./profile/main-content/new-post/Media"

interface MediaSectionProps {
  register: UseFormRegister<any>
  errors: FieldErrorsImpl
  addNewMedia: (newFiles: File[]) => void
  files: ContentFile[]
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  setFiles?: Dispatch<SetStateAction<ContentFile[]>>
  isNewPost?: boolean
  messages?: boolean
}

export const MediaSection: FC<MediaSectionProps> = ({
  register,
  errors,
  addNewMedia,
  files,
  onRemove,
  messages = false
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
    <div className="pt-5">
      {files.length === 0 ? (
        <FormInput
          className="h-[170px]"
          register={register}
          name={"drag-drop"}
          type="drag-drop-file"
          multiple={true}
          accept={ACCEPTED_MEDIA_TYPES}
          options={{ onChange: onDragDropChange }}
          errors={errors}
          helperText={`You may upload up to ${MAX_FILE_COUNT} pictures/videos per post`}
        />
      ) : (
        <div className="">
          {!!selectedMedia?.file && (
            <MediaModal
              isOpen={isNewPostModalOpen}
              setOpen={setIsNewPostModalOpen}
              file={selectedMedia}
              modalContainerClassname="p-0"
              childrenClassname="p-0"
            />
          )}
          {
            <style>
              {!messages
                ? `.swiper-button-next{
                margin-top: 0px;
                position: fixed;
                right: -9px;
                width: 45px;
                height: 45px;
                color:white;
                transform: scale(0.6, 0.9);
              }
              .swiper-button-prev{
                position: fixed;
                top: 50%;
                left: -9px;
                width: 45px;
                height: 45px;
                color:white;
                margin-top: 0px;
                transform: scale(0.6, 0.9);
          }`
                : `.swiper-button-next{
                  position: absolute;
                  right: -9px;
                  width: 45px;
                  height: 45px;
                  color:white;
                  transform: scale(0.6, 0.9);
                  mix-blend-mode: difference;
                }
                .swiper-button-prev{
                  position: absolute;
                  top: 50%;
                  left: -9px;
                  width: 45px;
                  height: 45px;
                  color:white;
                  transform: scale(0.6, 0.9);
                  mix-blend-mode: difference;
            }`}
            </style>
          }

          <Swiper
            className="mySwiper"
            slidesPerView={messages ? 3 : 4}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
          >
            {files.map(({ file, content }, index) => (
              <>
                {content && (
                  <SwiperSlide key={index}>
                    <Media
                      onRemove={(e: MouseEvent<HTMLDivElement>) =>
                        onRemove(index, e)
                      }
                      contentHeight={150}
                      contentWidth={150}
                      src={ContentService.userContentMediaPath(content)}
                      type={content.contentType}
                      iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
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
                  </SwiperSlide>
                )}
                {file && (
                  <SwiperSlide key={index}>
                    <MediaFile
                      className={classNames(
                        file.type.startsWith("image/")
                          ? "cursor-pointer rounded-[6px] object-contain"
                          : file.type.startsWith("video/")
                          ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                          : file.type.startsWith("aduio/")
                          ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                          : null
                      )}
                      contentHeight={150}
                      contentWidth={150}
                      iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
                      onRemove={(e: MouseEvent<HTMLDivElement>) =>
                        onRemove(index, e)
                      }
                      onSelect={() => onMediaFileSelect({ file, content })}
                      file={file}
                    />
                    {/* </div> */}
                  </SwiperSlide>
                )}
              </>
            ))}
            <SwiperSlide>
              <div className="flex min-h-[150px] min-w-[50px] items-center">
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
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </div>
  )
}
