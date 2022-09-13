import classNames from "classnames"
import { VaultDeselectButton, VaultSelectLabel } from "src/components/atoms"

interface IVaultSelectContainer {
  selectedItems: Array<string>
  deselectAll: () => void
  selectAll: () => void
}

const VaultSelectContainer = ({
  selectedItems,
  deselectAll,
  selectAll
}: IVaultSelectContainer) => {
  const hasSelectedItems = selectedItems?.length > 0
  const selectAllStyle = classNames(
    !hasSelectedItems ? "opacity-70 hover:opacity-100" : "opacity:100",
    "text-md mx-2 cursor-pointer text-right font-semibold text-white"
  )
  return (
    <div className="align-items mt-5 mb-0 flex items-center justify-between">
      <VaultSelectLabel selectedItemsLength={selectedItems?.length} />
      <div className="align-items flex items-center justify-center">
        <VaultDeselectButton
          isVisible={hasSelectedItems}
          deselectAll={deselectAll}
        />
        <div onClick={selectAll} className={selectAllStyle}>
          Select All
        </div>
      </div>
    </div>
  )
}

export { VaultSelectContainer }
