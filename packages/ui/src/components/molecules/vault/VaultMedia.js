import Image from "next/image"
import { VaultItemDate, VaultItemSelect } from "src/components/atoms"
import { classNames } from "src/helpers"
import useVaultSelect from "src/hooks/vault/useVaultSelect"

const VaultMediaItem = ({ itemData, selectedItems, setSelectedItems }) => {
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
        <Image
          alt={`vault-img-${itemData.id}`}
          src={itemData.url}
          layout="fill"
          objectFit="cover"
        />
        <div className="flex p-3">
          <VaultItemDate date={`${date.month} ${date.day}`} />
          <VaultItemSelect
            onSelectItem={onSelectItem}
            isSelected={isSelected}
          />
        </div>
      </div>
    </div>
  )
}

export { VaultMediaItem }
