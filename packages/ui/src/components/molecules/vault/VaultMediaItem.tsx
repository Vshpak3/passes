import classNames from "classnames"
import { format } from "date-fns"
import PlayIcon from "public/icons/media-play-circle-icon.svg"
import { FC, MouseEvent } from "react"

import { ContentService } from "src/helpers/content"
import { VaultMediaItemCachedProps } from "./VaultMediaItemCached"

type VaultMediaItemProps = VaultMediaItemCachedProps

export const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems,
  isMaxFileCountSelected,
  handleClickOnItem
}) => {
  const { contentId, contentType, createdAt, deletedAt, processed } = content

  const isSelected = !!selectedItems.filter((c) => c.contentId === contentId)
    .length

  const handleSelectItem = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (isMaxFileCountSelected) {
      return
    }

    setSelectedItems([...selectedItems, content])
  }

  const handleRemoveItem = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setSelectedItems(selectedItems.filter((c) => c.contentId !== contentId))
  }

  const handleClick = () => {
    handleClickOnItem(content)
  }

  const onSelectItem = isSelected ? handleRemoveItem : handleSelectItem

  return (
    <div className={classNames(deletedAt && "hidden", "group mb-[20px]")}>
      <div
        className={classNames(
          selectedItems.length > 0 && !isSelected
            ? "opacity-50"
            : "opacity-100",
          isSelected
            ? "border-1-[#9C4DC1]"
            : "border-1-[rgba(27, 20, 29, 0.5)]",
          "container flex w-full cursor-pointer flex-col-reverse overflow-hidden border bg-black px-0"
        )}
        onClick={handleClick}
      >
        {!processed ? (
          <div className="pt-4 pb-9 text-center">Content is processing</div>
        ) : contentType === "video" ? (
          <div className="relative flex items-center justify-center">
            <img
              alt="Media is missing"
              className="object-cover text-center"
              height={300}
              src={ContentService.userContentThumbnailPath(content)}
              width={300}
            />
            <div className="absolute">
              <PlayIcon />
            </div>
          </div>
        ) : (
          <img
            alt="Media is missing"
            className="object-cover text-center"
            height={300}
            src={ContentService.userContentThumbnailPath(content)}
            width={300}
          />
        )}

        <div className="m-[10px] flex justify-end" onClick={onSelectItem}>
          <div className="h-[23px] w-[50px] rounded-md bg-transparent">
            <div className="text-center text-[12px] font-medium uppercase text-white opacity-50">
              {format(createdAt || new Date(), "LLL dd")}
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
