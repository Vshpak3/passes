import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import { FC, MouseEvent } from "react"
import { ImageWithDefault } from "src/components/atoms/ImageWithDefault"
import { ContentService } from "src/helpers/content"

interface VaultMediaItemProps {
  content: ContentDto
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  isVideoSelected: boolean
  isMaxFileCountSelected: boolean
  handleClickOnItem: (item: ContentDto) => void
  index?: number
}

export const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems,
  isVideoSelected,
  isMaxFileCountSelected,
  handleClickOnItem,
  index
}) => {
  const isSelected = !!selectedItems.filter(
    (c) => c.contentId === content.contentId
  ).length

  const handleSelectItem = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (content.contentType === "video" && isVideoSelected) {
      return
    }

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
  const opacityStyle =
    selectedItems.length > 0 && !isSelected ? "opacity-50" : "opacity-100"
  return (
    <div
      className={classNames(
        index && index % 3 === 1 && "lg:pt-[20px]",
        index && index === 1 && "lg:pt-[0px]",
        "group"
      )}
    >
      <div
        className={classNames(
          opacityStyle,
          index && index === 1 && "lg:pb-[50px]",
          isSelected
            ? "border-1-[#9C4DC1]"
            : "border-1-[rgba(27, 20, 29, 0.5)]",
          "container flex w-fit cursor-pointer flex-col-reverse overflow-hidden rounded-[20px] border bg-black px-0 pb-[30px]"
        )}
        onClick={handleClick}
      >
        <div className="mx-[30px]">
          <ImageWithDefault // All content types have an image thumbnail
            src={ContentService.userContentThumbnailPath(content)}
            defaultColor="black/50"
            className="h-[234px] w-[307px] rounded-[20px] object-cover"
          />
        </div>
        <div className="flex justify-end p-[10px]">
          <div className="h-[23px] w-[50px] rounded-md bg-transparent ">
            <div
              onMouseDown={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              className="text-center text-[12px] font-medium uppercase text-white opacity-50"
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
