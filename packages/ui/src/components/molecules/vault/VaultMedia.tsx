import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import { FC, MouseEvent, useState } from "react"

import { ContentService } from "src/helpers/content"

interface VaultMediaItemProps {
  content: ContentDto
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  isMaxFileCountSelected: boolean
  handleClickOnItem: (item: ContentDto) => void
}

interface ImgSize {
  [key: string]: string | number
}

const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems,
  isMaxFileCountSelected,
  handleClickOnItem
}) => {
  const [imgSize, setImgSize] = useState<ImgSize>({ width: 300, height: 300 })
  const { width, height } = imgSize
  const isSelected = !!selectedItems.filter(
    (c) => c.contentId === content.contentId
  ).length

  const handleSelectItem = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (isMaxFileCountSelected) {
      return
    }

    setSelectedItems([...selectedItems, content])
  }

  const handleRemoveItem = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setSelectedItems(
      selectedItems.filter((c) => c.contentId !== content.contentId)
    )
  }

  const handleClick = () => {
    handleClickOnItem(content)
  }

  const onSelectItem = isSelected ? handleRemoveItem : handleSelectItem

  return (
    <div className="group mb-[20px]">
      <div
        className={classNames(
          selectedItems.length > 0 && !isSelected
            ? "opacity-50"
            : "opacity-100",
          isSelected
            ? "border-1-[#9C4DC1]"
            : "border-1-[rgba(27, 20, 29, 0.5)]",
          "container flex w-fit cursor-pointer flex-col-reverse overflow-hidden border bg-black px-0"
        )}
        onClick={handleClick}
      >
        <img
          alt="Can't find image"
          className="object-cover"
          height={height}
          onError={({ currentTarget }) => {
            setImgSize({ width: "fit-content", height: 300 })
            currentTarget.onerror = null
          }}
          // All content types have an image thumbnail
          src={ContentService.userContentThumbnailPath(content)}
          width={width}
        />
        <div className="m-[10px] flex justify-end" onClick={onSelectItem}>
          <div className="h-[23px] w-[50px] rounded-md bg-transparent">
            <div className="text-center text-[12px] font-medium uppercase text-white opacity-50">
              {format(content.createdAt || new Date(), "LLL dd")}
            </div>
          </div>
          <div
            className={classNames(
              isSelected
                ? "border-[#c943a8] bg-[#c943a8]"
                : "border-white bg-transparent",
              "hover:shadow-[0px_20px_20px_#12070E]] ml-[8px] h-[21px] w-[21px] rounded-full border-2 hover:shadow"
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default VaultMediaItem // eslint-disable-line import/no-default-export
