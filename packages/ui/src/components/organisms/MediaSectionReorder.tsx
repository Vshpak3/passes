import classNames from "classnames"
import { uniqueId } from "lodash"
import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from "react"
import { DragDropContext, DraggableLocation } from "react-beautiful-dnd"
import { FieldErrorsImpl } from "react-hook-form"

import { FormRegister } from "src/components/atoms/input/InputTypes"
import { MediaModal } from "src/components/organisms/MediaModal"
import { MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentFile } from "src/hooks/useMedia"
import { MediaSectionContents } from "./MediaSectionContents"

type ContentFileWithId = ContentFile & { _id: string }

type MediaSectionContents = {
  [key: string]: ContentFileWithId[]
}

interface MediaSectionReorderProps {
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

export const MediaSectionReorder: FC<MediaSectionReorderProps> = ({
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
  const [filesMap, setFilesMap] = useState<MediaSectionContents>({
    Free: [],
    Paid: []
  })

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
          const reorderedContent = reorderContent(filesMap, source, destination)
          setFilesMap(reorderedContent)
          setFiles([...reorderedContent["Free"], ...reorderedContent["Paid"]])
          if (isPaid && setMediaPreviewIndex) {
            setMediaPreviewIndex(reorderedContent["Free"].length)
          }
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
            <MediaSectionContents
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
                <MediaSectionContents
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
  fileMap: MediaSectionContents,
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
