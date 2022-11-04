import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import { FC, MouseEvent } from "react"

import { ContentService } from "src/helpers/content"

interface VaultMediaItemProps {
  content: ContentDto
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  isMaxFileCountSelected: boolean
  handleClickOnItem: (item: ContentDto) => void
}

const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems,
  isMaxFileCountSelected,
  handleClickOnItem
}) => {
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
    <div className={classNames("group mb-[20px]")}>
      <div
        className={classNames(
          selectedItems.length > 0 && !isSelected
            ? "opacity-50"
            : "opacity-100",
          isSelected
            ? "border-1-[#9C4DC1]"
            : "border-1-[rgba(27, 20, 29, 0.5)]",
          "container flex w-fit cursor-pointer flex-col-reverse overflow-hidden rounded-[15px] border bg-black px-0" // pb-[30px]"
        )}
        onClick={handleClick}
      >
        <img
          alt="Can't find image"
          className="object-cover"
          height={300}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
          }}
          // All content types have an image thumbnail
          src={ContentService.userContentThumbnailPath(content)}
          width={300}
        />
        <div className="flex justify-end p-[10px]">
          <div className="h-[23px] w-[50px] rounded-md bg-transparent">
            <div
              className="text-center text-[12px] font-medium uppercase text-white opacity-50"
              onCopy={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
            >
              {format(content.createdAt || new Date(), "LLL dd")}
            </div>
          </div>
          <div
            className={classNames(
              isSelected
                ? "border-[#c943a8] bg-[#c943a8]"
                : "border-white bg-transparent",
              "hover:shadow-[0px_20px_20px_#1b141d]] h-[21px] w-[21px] rounded-full border-2 hover:shadow"
            )}
            onClick={onSelectItem}
          />
        </div>
      </div>
    </div>
  )
}

export default VaultMediaItem // eslint-disable-line import/no-default-export
