import DragDots from "public/icons/post-draggable-dots.svg"
import { FC, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"

import { ItemTypes } from "./item-types"

interface CardProps {
  id: any
  children: any
  index: any
  moveCard: any
}

export const Card: FC<CardProps> = ({ id, children, index, moveCard }) => {
  const ref = useRef(null)
  const previewRef = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = (item as any).index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = (ref.current as any)?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset() ?? { y: 0 }
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(
        dragIndex,
        hoverIndex
      )(
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item as any
      ).index = hoverIndex
    }
  })
  const { 1: drag, 2: preview } = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    }
  })
  drag(ref)
  drop(preview(previewRef))
  return (
    <div className="relative" ref={previewRef}>
      <div
        data-handler-id={handlerId}
        ref={ref}
        className="absolute inset-y-0 left-0 top-1 z-10 flex cursor-move items-center pl-[5px]"
      >
        <DragDots />
      </div>
      {children}
    </div>
  )
}
