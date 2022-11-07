import { ContentDto } from "@passes/api-client"
import ExitIcon from "public/icons/exit-icon.svg"
import { FC } from "react"

import { plural } from "src/helpers/plural"

interface VaultSelectContainerProps {
  selectedItems: Array<ContentDto>
  deselectAll: () => void
}

export const VaultSelectContainer: FC<VaultSelectContainerProps> = ({
  selectedItems,
  deselectAll
}) => (
  <div className="mt-4 mb-0 flex items-center gap-3">
    {selectedItems?.length > 0 && (
      <>
        <div
          className="h-[18px] w-[18px] cursor-pointer justify-center text-[#000000]"
          onClick={deselectAll}
        >
          <ExitIcon />
        </div>
        <div className="font-semibold text-white">
          {plural("item", selectedItems?.length)} selected
        </div>
      </>
    )}
  </div>
)
