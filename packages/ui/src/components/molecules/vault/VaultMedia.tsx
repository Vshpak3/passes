import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { VaultItemDate } from "src/components/atoms"
import useVaultSelect from "src/hooks/vault/useVaultSelect"

interface IVaultMediaItem {
  itemData: ContentDto
  selectedItems: Array<string>
  setSelectedItems: Dispatch<SetStateAction<Array<string>>>
}

const VaultMediaItem = ({
  itemData,
  selectedItems,
  setSelectedItems
}: IVaultMediaItem) => {
  const { date, onSelectItem, opacityStyle, isSelected } = useVaultSelect({
    itemData,
    selectedItems,
    setSelectedItems
  })
  return (
    <div className="group">
      <div
        className={classNames(
          opacityStyle,
          "dropdown-shadow aspect-w-1 aspect-h-1 w-full cursor-pointer overflow-hidden rounded-[5px] bg-gray-200 md:rounded-[20px] xl:aspect-w-8 xl:aspect-h-8"
        )}
      >
        {itemData.signedUrl ? (
          <Image
            alt={`vault-img-${itemData.contentId}`}
            src={itemData.signedUrl}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          ""
        )}
        <div className="flex p-3">
          <VaultItemDate date={`${date.month} ${date.day}`} />
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

export { VaultMediaItem }
