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
}

export const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems,
  isVideoSelected,
  isMaxFileCountSelected,
  handleClickOnItem
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
    <div className="group">
      <div
        className={classNames(
          opacityStyle,
          "dropdown-shadow aspect-w-1 aspect-h-1 w-full cursor-pointer overflow-hidden rounded-[5px] bg-gray-200 md:rounded-[20px] xl:aspect-w-8 xl:aspect-h-8"
        )}
        onClick={handleClick}
      >
        <ImageWithDefault // All content types have an image thumbnail
          src={ContentService.userContentThumbnailPath(content)}
          defaultColor="black/50"
        />
        <div className="flex p-3">
          <div className="mr-auto h-[23px] w-[50px] rounded-md bg-transparent md:bg-[#00000030] ">
            <div
              onMouseDown={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              className="hidden text-center text-[11px] font-semibold text-white md:block"
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
