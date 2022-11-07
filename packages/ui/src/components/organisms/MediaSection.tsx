// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import classNames from "classnames"
import {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  MouseEvent,
  SetStateAction,
  useState
} from "react"
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"
import { Navigation } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

import { DragDropFile } from "src/components/molecules/DragDropFile"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
// import { preventNegative } from "src/helpers/keyboard"
import { ContentFile } from "src/hooks/useMedia"
import { MediaSectionReorder } from "./MediaSectionReorder"
// import { MediaSectionReorderPriced } from "./MediaSectionReorderPriced"
import { Media, MediaFile } from "./profile/main-content/new-post/Media"

interface MediaSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  errors: Partial<FieldErrorsImpl>
  addNewMedia: (newFiles: FileList | null) => void
  files: ContentFile[]
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
  isPaid: boolean
  reorderContent?: boolean
  mediaPreviewIndex: number
  setMediaPreviewIndex?: Dispatch<SetStateAction<number>>
}

export const MediaSection: FC<MediaSectionProps> = ({
  register,
  errors,
  addNewMedia,
  files,
  setFiles,
  onRemove,
  isPaid,
  reorderContent,
  mediaPreviewIndex,
  setMediaPreviewIndex
}) => {
  const [selectedMedia, setSelectedMedia] = useState<ContentFile>()
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  // const [reorder, setReorder] = useState(false)

  const onMediaFileSelect = (file: ContentFile) => {
    setSelectedMedia(file)
    setIsNewPostModalOpen(true)
  }

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  return (
    <>
      {reorderContent ? (
        <div className="flex w-full">
          <MediaSectionReorder
            files={files}
            isPaid={isPaid}
            mediaPreviewIndex={mediaPreviewIndex}
            setFiles={setFiles}
            setMediaPreviewIndex={setMediaPreviewIndex}
          />
        </div>
      ) : (
        <div className="pt-5">
          {files.length === 0 ? (
            <DragDropFile
              accept={ACCEPTED_MEDIA_TYPES}
              className="h-[170px]"
              errors={errors}
              helperText={`You may upload up to ${MAX_FILE_COUNT} pictures/videos per post`}
              multiple
              name="drag-drop"
              options={{ onChange: onFileInputChange }}
              register={register}
            />
          ) : (
            <div className="">
              {!!selectedMedia?.file && (
                <MediaModal
                  childrenClassname="p-0"
                  file={selectedMedia}
                  isOpen={isNewPostModalOpen}
                  modalContainerClassname="p-0"
                  setOpen={setIsNewPostModalOpen}
                />
              )}

              <Swiper
                modules={[Navigation]}
                navigation
                slidesPerView={4}
                spaceBetween={10}
              >
                {files.map(({ file, content }, index) => (
                  <Fragment key={index}>
                    {content && (
                      <SwiperSlide key={index}>
                        <Media
                          className={classNames(
                            content.contentType.startsWith("image/")
                              ? "cursor-pointer rounded-[6px] object-contain"
                              : content.contentType.startsWith("video/")
                              ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                              : content.contentType.startsWith("aduio/")
                              ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                              : null
                          )}
                          contentHeight={150}
                          contentWidth={150}
                          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
                          onRemove={(e: MouseEvent<HTMLDivElement>) =>
                            onRemove(index, e)
                          }
                          src={ContentService.userContentMediaPath(content)}
                          type={content.contentType}
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
                          file={file}
                          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
                          onRemove={(e: MouseEvent<HTMLDivElement>) =>
                            onRemove(index, e)
                          }
                          onSelect={() => onMediaFileSelect({ file, content })}
                        />
                      </SwiperSlide>
                    )}
                  </Fragment>
                ))}
                <SwiperSlide>
                  {files.length !== MAX_FILE_COUNT && (
                    <DragDropFile
                      accept={ACCEPTED_MEDIA_TYPES}
                      className="flex min-h-[150px] w-[150px] items-center"
                      errors={errors}
                      multiple
                      name="drag-drop"
                      options={{ onChange: onFileInputChange }}
                      register={register}
                    />
                  )}
                </SwiperSlide>
              </Swiper>
            </div>
          )}
        </div>
      )}
    </>
  )
}
