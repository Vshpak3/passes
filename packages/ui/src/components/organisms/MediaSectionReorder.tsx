import classNames from "classnames"
import { uniqueId } from "lodash"
import BoxIcon from "public/icons/cursor-box-icon.svg"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable
} from "react-beautiful-dnd"

import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { Media, MediaFile } from "./profile/main-content/new-post/Media"

interface Props {
  items: Array<ContentFile & { _id: string }>
  listId: string
  internalScroll?: boolean
  isCombineEnabled?: boolean
}

type Contents = {
  [key: string]: Array<ContentFile & { _id: string }>
}

const getMediaClassname = (contentType: string) => {
  switch (true) {
    case contentType.startsWith("image/"):
      return "cursor-grab select-none rounded-[6px] object-contain"
    case contentType.startsWith("video/"):
      return "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
    case contentType.startsWith("audio/"):
      return "absolute inset-0 m-auto min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
    default:
      return ""
  }
}
const Contents: FC<Props> = ({ listId, items }) => {
  return (
    <Droppable
      droppableId={listId}
      type="CARD"
      direction="horizontal"
      isCombineEnabled={false}
    >
      {(dropProvided) => (
        <div
          {...dropProvided.droppableProps}
          className="h-full w-full overflow-x-hidden"
        >
          <div
            className="flex min-h-[175px] min-w-[175px] gap-[12px] overflow-x-auto  "
            ref={dropProvided.innerRef}
          >
            {listId === "Free" && items.length === 0 ? (
              <div className="flex h-[175px] w-full flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-2 rounded-[5px] border border-[#FF51A8] bg-[#0F0C10] px-6">
                <BoxIcon />
                <p className="text-center  text-[12px] font-normal leading-[16px] text-[#888689]">
                  Reorder and drag content here to post as free preview
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      className="flex flex-shrink-0"
                      {...dragProvided.dragHandleProps}
                      {...dragProvided.draggableProps}
                      ref={dragProvided.innerRef}
                    >
                      {item.content ? (
                        <Media
                          contentHeight={175}
                          preview
                          contentWidth={175}
                          src={ContentService.userContentMediaPath(
                            item.content
                          )}
                          type={item.content.contentType}
                          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
                          className={classNames(
                            snapshot.isDragging
                              ? "!cursor-grabbing select-none"
                              : getMediaClassname(item.content.contentType)
                          )}
                        />
                      ) : item.file ? (
                        <MediaFile
                          preview
                          className={classNames(
                            snapshot.isDragging
                              ? "!cursor-grabbing select-none"
                              : getMediaClassname(item.file.type)
                          )}
                          contentHeight={175}
                          contentWidth={175}
                          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
                          file={item.file}
                        />
                      ) : null}
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {dropProvided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export const MediaSectionReorder = ({
  files,
  setFiles,
  mediaPreviewIndex,
  setMediaPreviewIndex,
  isPaid
}: {
  files: Array<ContentFile & { _id: string }>
  setFiles: any
  mediaPreviewIndex: number
  setMediaPreviewIndex: Dispatch<SetStateAction<number>>
  isPaid: boolean
}) => {
  const [filesMap, setFilesMap] = useState<Contents>({ Free: [], Paid: [] })

  useEffect(() => {
    setFiles([...filesMap["Free"], ...filesMap["Paid"]])
    if (isPaid) {
      setMediaPreviewIndex(filesMap["Free"].length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesMap, setFiles, setMediaPreviewIndex])

  useEffect(() => {
    getContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid])

  const getContent = () => {
    setFilesMap(
      !isPaid
        ? {
            Free: files.map((file) => {
              file["_id"] = file["_id"] ?? uniqueId()
              return file
            }),
            Paid: []
          }
        : {
            Free: files.slice(0, mediaPreviewIndex).map((file) => {
              file["_id"] = file["_id"] ?? uniqueId()
              return file
            }),
            Paid: files.slice(mediaPreviewIndex).map((file) => {
              file["_id"] = file["_id"] ?? uniqueId()
              return file
            })
          }
    )
  }

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        // // dropped outside the list
        if (!destination) {
          return
        }

        setFilesMap(reorderContent(filesMap, source, destination))
      }}
    >
      <div className="flex h-full w-full items-end">
        <div
          className={classNames(
            "flex min-h-[175px] flex-col overflow-hidden",
            isPaid ? "min-w-[35%] max-w-[50%]" : "w-full"
          )}
        >
          {isPaid && (
            <div className="text-[12px] font-medium leading-[24px] text-[#FF51A8]">
              Free Preview
            </div>
          )}
          <div className="flex overflow-x-auto">
            <Contents
              internalScroll
              key="Free"
              listId="Free"
              items={filesMap["Free"]}
            />
          </div>
        </div>
        {isPaid && (
          <>
            <div className="mx-3 h-full min-h-[175px] border-r border-[#FF51A8]" />
            <div className="flex w-full min-w-[65%] flex-col overflow-hidden">
              <div className="text-[12px] font-medium leading-[24px] text-[#FF51A8]">
                Pay to View
              </div>
              <div className="flex items-center overflow-x-auto">
                <Contents
                  internalScroll
                  key="Paid"
                  listId="Paid"
                  items={filesMap["Paid"]}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DragDropContext>
  )
}
// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
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
