import { ContentDto } from "@passes/api-client"
import { FC } from "react"

import {
  VaultDeselectButton,
  VaultSelectLabel
} from "src/components/atoms/vault"

interface VaultSelectContainerProps {
  selectedItems: Array<ContentDto>
  deselectAll: () => void
}

export const VaultSelectContainer: FC<VaultSelectContainerProps> = ({
  selectedItems,
  deselectAll
}) => {
  const hasSelectedItems = selectedItems?.length > 0
  return (
    <div className="align-items mt-1 mb-0 flex items-center justify-between">
      <VaultSelectLabel selectedItemsLength={selectedItems?.length} />
      <div className="align-items flex items-center justify-center">
        <VaultDeselectButton
          deselectAll={deselectAll}
          isVisible={hasSelectedItems}
        />
      </div>
    </div>
  )
}
