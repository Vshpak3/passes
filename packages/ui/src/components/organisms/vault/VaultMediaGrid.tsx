import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDto,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryResponseDto
} from "@passes/api-client"
import { FC } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { VaultMediaItem } from "src/components/molecules/vault/VaultMedia"
import { TVaultCategory, TVaultType } from "src/components/pages/tools/Vault"

interface VaultMediaGridProps {
  selectedItems: Array<string>
  setSelectedItems: (items: string[]) => void
  order: GetVaultQueryRequestDtoOrderEnum
  category?: TVaultCategory
  type?: TVaultType
  deletedItems: string[]
}

export const VaultMediaGrid: FC<VaultMediaGridProps> = ({
  selectedItems,
  setSelectedItems,
  category,
  type,
  order,
  deletedItems
}) => {
  return (
    <div className="max-h-[65vh] justify-center overflow-y-scroll">
      <div className="grid grid-cols-3 gap-2">
        <InfiniteScrollPagination<ContentDto, GetVaultQueryResponseDto>
          keyValue={`vault`}
          fetch={async (req: GetVaultQueryRequestDto) => {
            const api = new ContentApi()
            return await api.getVaultContent({
              getVaultQueryRequestDto: req
            })
          }}
          fetchProps={{ category, type, order }}
          emptyElement={
            <>
              <div className="col-span-1 w-[115px] md:w-[320px]" />
              <div className="col-span-1 w-[115px] md:w-[320px]" />
              <div className="col-span-1 w-[115px] md:w-[320px]" />
            </>
          }
          KeyedComponent={({ arg }: ComponentArg<ContentDto>) => {
            return (
              <>
                {deletedItems.includes(arg.contentId) && (
                  <VaultMediaItem
                    content={arg}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                  />
                )}
              </>
            )
          }}
          classes="mt-[25px] grid grid-cols-2 gap-[25px] pb-20 sidebar-collapse:grid-cols-3"
        />
      </div>
    </div>
  )
}
