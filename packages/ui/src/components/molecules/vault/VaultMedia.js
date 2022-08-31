import Image from "next/image"
import { VaultItemDate, VaultItemSelect } from "src/components/atoms"
import { classNames } from "src/helpers"
import useVaultSelect from "src/hooks/useVaultSelect"

const VaultMediaItem = ({ itemData, selectedItems, setSelectedItems }) => {
  const { date, onSelectItem, opacityStyle, isSelected } = useVaultSelect({
    itemData,
    selectedItems,
    setSelectedItems
  })

  return (
    <div className="col-span-1 h-[115px] w-[115px] cursor-pointer drop-shadow md:h-[320px] md:w-[320px]">
      <div
        className={classNames(
          opacityStyle,
          "relative h-full w-full rounded-[20px]"
        )}
      >
        <Image
          alt={`vault-img-${itemData.id}`}
          src={itemData.url}
          layout="fill"
          objectFit="cover"
          className="block h-full w-full rounded-xl object-cover object-center"
        />
      </div>
      <VaultItemDate date={`${date.month} ${date.day}`} />
      <VaultItemSelect onSelectItem={onSelectItem} isSelected={isSelected} />
    </div>
  )
}

export { VaultMediaItem }
