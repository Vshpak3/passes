import classNames from "classnames"
import UploadPlusIcon from "public/icons/content-upload-icon.svg"
import BoxIcon from "public/icons/cursor-box-icon.svg"
import { ChangeEvent, FC, MouseEvent } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { FieldErrorsImpl } from "react-hook-form"

import { FileInput } from "src/components/atoms/input/FileInput"
import { FormRegister } from "src/components/atoms/input/InputTypes"
import { ACCEPTED_MEDIA_TYPES } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { Media } from "./profile/main-content/new-post/Media"
import { MediaFile } from "./profile/main-content/new-post/MediaFile"

type ContentFileWithId = ContentFile & { _id: string }

interface MediaSectionContentsProps {
  items: ContentFileWithId[]
  listId: string
  internalScroll?: boolean
  isCombineEnabled?: boolean
  onMediaFileSelect: (item: ContentFileWithId) => void
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  renderPlusIcon?: boolean
  register: FormRegister
  errors: Partial<FieldErrorsImpl>
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const getMediaClassname = (contentType: string) => {
  switch (true) {
    case contentType.startsWith("image"):
      return "cursor-grab select-none rounded-[6px] object-cover min-h-[85px] h-[85px] md:h-[175px] md:max-w-[175px] md:min-w-[175px] max-w-[85px] min-w-[85px] z-[2]"
    case contentType.startsWith("video"):
      return "cursor-grab select-none rounded-[6px] object-cover min-h-[85px] h-[85px] md:h-[175px] md:max-w-[175px] md:min-w-[175px] max-w-[85px] min-w-[85px] z-[2]"
    case contentType.startsWith("audio"):
      return "absolute inset-0 m-auto min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
    default:
      return ""
  }
}

export const MediaSectionContents: FC<MediaSectionContentsProps> = ({
  listId,
  items,
  onMediaFileSelect,
  onRemove,
  renderPlusIcon,
  onFileInputChange,
  register,
  errors
}) => {
  return (
    <Droppable
      direction="horizontal"
      droppableId={listId}
      isCombineEnabled={false}
      type="CARD"
    >
      {(dropProvided) => (
        <div
          {...dropProvided.droppableProps}
          className="h-full w-full overflow-x-hidden"
        >
          <div
            className="flex min-h-[85px] min-w-[85px] gap-[12px] overflow-x-auto md:min-h-[175px] md:min-w-[175px]"
            ref={dropProvided.innerRef}
          >
            {listId === "Free" && items.length === 0 ? (
              <div className="flex h-[85px] w-full shrink-0 grow-0 flex-col items-center justify-center gap-2 rounded-[5px] border border-[#FF51A8] bg-[#0F0C10] px-0 md:h-[175px]  md:px-6">
                <BoxIcon />
                <p className="text-center text-[9px] font-normal text-[#888689] md:text-[12px] md:leading-[16px]">
                  Reorder and drag content here to post as free preview
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <Draggable draggableId={item._id} index={index} key={item._id}>
                  {(dragProvided, snapshot) => (
                    <div
                      className="relative z-[2] flex w-[85px] min-w-[85px] shrink-0 md:w-[175px] md:min-w-[175px]"
                      {...dragProvided.dragHandleProps}
                      {...dragProvided.draggableProps}
                      ref={dragProvided.innerRef}
                    >
                      {item.content ? (
                        <Media
                          className={classNames(
                            snapshot.isDragging
                              ? "min-w-[85px] !cursor-grabbing select-none md:min-w-[175px]"
                              : getMediaClassname(item.content.contentType)
                          )}
                          iconClassName="z-[100] absolute top-[5px] left-[55px] md:left-[140px] mix-blend-difference"
                          noRender
                          noRenderString={`Vault Video content #${index}`}
                          objectFit="cover"
                          onRemove={(e: MouseEvent<HTMLDivElement>) =>
                            onRemove(index, e)
                          }
                          onSelect={() => onMediaFileSelect(item)}
                          src={ContentService.userContentMediaPath(
                            item.content
                          )}
                          type={item.content.contentType}
                        />
                      ) : item.file ? (
                        <MediaFile
                          className={classNames(
                            snapshot.isDragging
                              ? "min-w-[85px] !cursor-grabbing select-none md:min-w-[175px]"
                              : getMediaClassname(item.file.type)
                          )}
                          file={item.file}
                          iconClassName="z-[100] absolute top-[5px] left-[55px] md:left-[140px] mix-blend-difference"
                          noRender
                          noRenderString={item.file.name}
                          objectFit="cover"
                          onRemove={(e: MouseEvent<HTMLDivElement>) =>
                            onRemove(index, e)
                          }
                          onSelect={() => onMediaFileSelect(item)}
                        />
                      ) : null}
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {dropProvided.placeholder}
            {renderPlusIcon && (
              <FileInput
                accept={ACCEPTED_MEDIA_TYPES}
                className="flex cursor-pointer items-center"
                errors={errors}
                multiple
                name="files"
                options={{ onChange: onFileInputChange }}
                register={register}
                trigger={<UploadPlusIcon />}
              />
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}
