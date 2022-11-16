import classNames from "classnames"
import { DragEvent, FC, useState } from "react"

type DragDropProps = {
  className?: string
  onChange?: (event: DragEvent<HTMLDivElement>) => void
  onBlur?: (event: DragEvent<HTMLDivElement>) => void
  children?: JSX.Element | ((props: { isDragging: boolean }) => JSX.Element)
}

export const DragDrop: FC<DragDropProps> = ({
  className = "",
  children,
  onChange,
  onBlur
}) => {
  const [isDragging, setIsDragging] = useState(false)

  // handle drag events
  const handleDrag = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragging(true)
    } else if (event.type === "dragleave") {
      setIsDragging(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (onChange) {
        onChange(event)
      }
      if (onBlur) {
        onBlur(event)
      }
    }
  }

  const renderedChildren =
    typeof children === "function" ? children({ isDragging }) : children
  return (
    <div
      className={classNames(className, "h-full w-full")}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {renderedChildren}
    </div>
  )
}
