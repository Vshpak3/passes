import { FC } from "react"
import {
  VaultDeselectButton,
  VaultSelectLabel
} from "src/components/atoms/vault"

interface VaultSelectContainerProps {
  selectedItems: Array<string>
  deselectAll: () => void
}

export const VaultSelectContainer: FC<VaultSelectContainerProps> = ({
  selectedItems,
  deselectAll
}) => {
  const hasSelectedItems = selectedItems?.length > 0
  return (
    <div className="align-items mt-5 mb-0 flex items-center justify-between">
      <VaultSelectLabel selectedItemsLength={selectedItems?.length} />
      <div className="align-items flex items-center justify-center">
        <VaultDeselectButton
          isVisible={hasSelectedItems}
          deselectAll={deselectAll}
        />
      </div>
    </div>
  )
}
