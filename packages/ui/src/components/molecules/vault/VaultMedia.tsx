import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"
interface VaultMediaItemProps {
  content: ContentDto
  selectedItems: Array<string>
  setSelectedItems: (items: string[]) => void
}

export const VaultMediaItem: FC<VaultMediaItemProps> = ({
  content,
  selectedItems,
  setSelectedItems
}) => {
  const date = content.createdAt.toDateString().slice(5, 11)

  const isSelected = selectedItems.includes(content.contentId)

  const handleSelectItem = () => {
    setSelectedItems([...selectedItems, content.contentId])
  }
  const handleRemoveItem = () => {
    const itemsArr = selectedItems.slice()
    itemsArr.splice(itemsArr.indexOf(content.contentId), 1)
    setSelectedItems(itemsArr)
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
      >
        {content.signedUrl ? (
          <img
            src={content.signedUrl}
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = "" // TODO: consider adding default image
            }}
          />
        ) : (
          ""
        )}
        <div className="flex p-3">
          <div className="mr-auto h-[23px] w-[50px] rounded-md bg-transparent md:bg-[#00000030] ">
            <div
              onMouseDown={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              className="hidden text-center text-[11px] font-semibold text-[#ffffff] md:block"
            >
              {date}
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
