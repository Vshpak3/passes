import classNames from "classnames"
import type { Identifier, XYCoord } from "dnd-core"
import update from "immutability-helper"
import type { Dispatch, FC, SetStateAction } from "react"
import { useCallback, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"

import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { Media, MediaFile } from "./profile/main-content/new-post/Media"

interface ContentProps {
  item: ContentFile
  index: number
  moveContent: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  item: ContentFile
}

interface MediaSectionProps {
  files: ContentFile[]
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
}

export const MediaSectionReorder: FC<MediaSectionProps> = ({
  files,
  setFiles
}: MediaSectionProps) => {
  {
    const moveContent = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        setFiles((prevContents: ContentFile[]) =>
          update(prevContents, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevContents[dragIndex] as ContentFile]
            ]
          })
        )
      },
      [setFiles]
    )

    const renderContent = useCallback(
      (item: ContentFile, index: number) => {
        return <Content item={item} index={index} moveContent={moveContent} />
      },
      [moveContent]
    )

    return (
      <div className="flex items-center gap-3 overflow-x-auto">
        {files.map((file, i) => renderContent(file, i))}
      </div>
    )
  }
}

const Content: FC<ContentProps> = ({ item, index, moveContent }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "content",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveContent(dragIndex, hoverIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: "content",
    item: () => {
      return { index, item }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))
  return (
    <div
      ref={ref}
      className={classNames(
        isDragging ? "opacity-0 " : "opacity-100",
        "h-[150px] min-w-[150px] "
      )}
      data-handler-id={handlerId}
    >
      {item.content ? (
        <Media
          contentHeight={150}
          preview
          contentWidth={150}
          src={ContentService.userContentMediaPath(item.content)}
          type={item.content.contentType}
          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
          className={classNames(
            isDragging
              ? "!cursor-grabbing select-none"
              : item.content.contentType.startsWith("image/")
              ? " cursor-grab select-none rounded-[6px] object-contain"
              : item.content.contentType.startsWith("video/")
              ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
              : item.content.contentType.startsWith("audio/")
              ? "absolute inset-0 m-auto min-w-full max-w-full cursor-grab select-none rounded-[6px] object-cover"
              : null
          )}
        />
      ) : item.file ? (
        <MediaFile
          preview
          className={classNames(
            isDragging
              ? "!cursor-grabbing select-none"
              : item.file.type.startsWith("image/")
              ? "cursor-grab select-none rounded-[6px] object-contain"
              : item.file.type.startsWith("video/")
              ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-grab select-none  rounded-[6px] object-cover"
              : item.file.type.startsWith("audio/")
              ? "absolute inset-0 m-auto min-w-full max-w-full cursor-grab select-none  rounded-[6px] object-cover"
              : null
          )}
          contentHeight={150}
          contentWidth={150}
          iconClassName="absolute top-[10px] right-[10px] mix-blend-difference"
          file={item.file}
        />
      ) : null}
    </div>
  )
}
