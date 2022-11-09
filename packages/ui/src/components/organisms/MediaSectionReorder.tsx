import classNames from "classnames"
import { uniqueId } from "lodash"
import BoxIcon from "public/icons/cursor-box-icon.svg"
import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from "react"
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable
} from "react-beautiful-dnd"
import { FieldErrorsImpl } from "react-hook-form"

import { FormRegister } from "src/components/atoms/input/InputTypes"
import { DragDropFile } from "src/components/molecules/DragDropFile"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { Media, MediaFile } from "./profile/main-content/new-post/Media"

type ContentFileWithId = ContentFile & { _id: string }

interface ContentsProps {
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

type Contents = {
  [key: string]: ContentFileWithId[]
}

const getMediaClassname = (contentType: string) => {
  switch (true) {
    case contentType.startsWith("image/"):
      return "cursor-grab select-none rounded-[6px] object-cover min-h-[85px] h-[85px] md:h-[175px] md:max-w-[175px] md:min-w-[175px] max-w-[85px] min-w-[85px] z-[2]"
    case contentType.startsWith("video/"):
      return "cursor-grab select-none rounded-[6px] object-cover min-h-[85px] h-[85px] md:h-[175px] md:max-w-[175px] md:min-w-[175px] max-w-[85px] min-w-[85px] z-[2]"
    case contentType.startsWith("audio/"):
      return "absolute inset-0 m-auto min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
    default:
      return ""
  }
}

const Contents: FC<ContentsProps> = ({
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
              <DragDropFile
                accept={ACCEPTED_MEDIA_TYPES}
                className="flex max-h-[85px] min-w-[85px] items-center md:min-h-[175px] md:min-w-[175px] "
                errors={errors}
                multiple
                name="drag-drop"
                options={{ onChange: onFileInputChange }}
                register={register}
              />
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}

interface MediaSectionReorderPops {
  files: ContentFile[]
  register: FormRegister
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
  addNewMedia: (newFiles: FileList | null) => void
  mediaPreviewIndex: number
  setMediaPreviewIndex: Dispatch<SetStateAction<number>> | undefined
  isPaid: boolean
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  errors: Partial<FieldErrorsImpl>
}

export const MediaSectionReorder: FC<MediaSectionReorderPops> = ({
  files,
  register,
  setFiles,
  addNewMedia,
  mediaPreviewIndex = 0,
  setMediaPreviewIndex,
  isPaid,
  onRemove,
  errors
}) => {
  const [filesMap, setFilesMap] = useState<Contents>({ Free: [], Paid: [] })

  const [selectedMedia, setSelectedMedia] = useState<ContentFile>()
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const onMediaFileSelect = (file: ContentFile) => {
    setSelectedMedia(file)
    setIsNewPostModalOpen(true)
  }

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  useEffect(() => {
    if (filesMap["Free"].length || filesMap["Paid"].length) {
      setFiles([...filesMap["Free"], ...filesMap["Paid"]])
    }

    if (isPaid && setMediaPreviewIndex) {
      setMediaPreviewIndex(filesMap["Free"].length)
    }
  }, [filesMap, isPaid, setFiles, setMediaPreviewIndex])

  useEffect(() => {
    getContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid])

  useEffect(() => {
    // This code only fires on length change
    getContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length])

  const setId = (file: ContentFile) => {
    const _file = file as ContentFileWithId
    _file["_id"] = _file["_id"] ?? uniqueId()
    return _file
  }

  const getContent = () => {
    setFilesMap(
      !isPaid
        ? {
            Free: files.map(setId),
            Paid: []
          }
        : {
            Free: files.slice(0, mediaPreviewIndex).map(setId),
            Paid: files.slice(mediaPreviewIndex).map(setId)
          }
    )
  }

  return (
    <div className="flex h-full w-full">
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          // // dropped outside the list
          if (!destination) {
            return
          }

          setFilesMap(reorderContent(filesMap, source, destination))
        }}
      >
        <div
          className={classNames(
            "flex  min-h-[85px] flex-col overflow-hidden md:min-h-[175px]",
            isPaid
              ? " min-w-[40%] max-w-[40%] md:min-w-[35%] md:max-w-[50%]"
              : "w-full"
          )}
        >
          {isPaid && (
            <div className="text-[12px] font-medium leading-[24px] text-[#FF51A8]">
              Free Preview
            </div>
          )}
          <div className="flex overflow-x-auto">
            <Contents
              errors={errors}
              internalScroll
              items={filesMap["Free"]}
              key="Free"
              listId="Free"
              onFileInputChange={onFileInputChange}
              onMediaFileSelect={onMediaFileSelect}
              onRemove={onRemove}
              register={register}
              renderPlusIcon={!isPaid && files.length !== MAX_FILE_COUNT}
            />
          </div>
        </div>
        {isPaid && (
          <>
            <div className="mx-3 h-[85px] self-end border-r border-[#FF51A8] md:h-[175px]" />
            <div className="flex w-full min-w-[50%] max-w-[40%] flex-col overflow-hidden md:min-w-[60%]">
              <div className="text-[12px] font-medium leading-[24px] text-[#FF51A8]">
                Pay to View
              </div>
              <div className="flex items-center overflow-x-auto">
                <Contents
                  errors={errors}
                  internalScroll
                  items={filesMap["Paid"]}
                  key="Paid"
                  listId="Paid"
                  onFileInputChange={onFileInputChange}
                  onMediaFileSelect={onMediaFileSelect}
                  onRemove={onRemove}
                  register={register}
                  renderPlusIcon={isPaid && files.length !== MAX_FILE_COUNT}
                />
              </div>
            </div>
          </>
        )}
      </DragDropContext>

      {!!selectedMedia?.file && (
        <MediaModal
          childrenClassname="p-0"
          file={selectedMedia}
          isOpen={isNewPostModalOpen}
          modalContainerClassname="p-0"
          setOpen={setIsNewPostModalOpen}
        />
      )}
    </div>
  )
}
// a little function to help us with reordering the result
const reorder = (
  list: ContentFileWithId[],
  startIndex: number,
  endIndex: number
): ContentFileWithId[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const reorderContent = (
  fileMap: Contents,
  source: DraggableLocation,
  destination: DraggableLocation
) => {
  const current = [...fileMap[source.droppableId]]
  const next = [...fileMap[destination.droppableId]]
  const target = current[source.index]

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index)
    return {
      ...fileMap,
      [source.droppableId]: reordered
    }
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1)
  // insert into next
  next.splice(destination.index, 0, target)

  return {
    ...fileMap,
    [source.droppableId]: current,
    [destination.droppableId]: next
  }
}
