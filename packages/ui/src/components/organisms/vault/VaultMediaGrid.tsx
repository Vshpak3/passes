import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDto,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryResponseDto
} from "@passes/api-client"
import { FC, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { VaultMediaItem } from "src/components/molecules/vault/VaultMedia"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"

import { VaultMediaModal } from "./VaultMediaModal"

interface VaultMediaGridProps {
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  order: GetVaultQueryRequestDtoOrderEnum
  category?: VaultCategory
  type?: VaultType
  deletedItems: ContentDto[]
  isVideoSelected: boolean
  isMaxFileCountSelected: boolean
}

export const VaultMediaGrid: FC<VaultMediaGridProps> = ({
  selectedItems,
  setSelectedItems,
  category,
  type,
  order,
  deletedItems,
  isVideoSelected,
  isMaxFileCountSelected
}) => {
  const [isViewMediaModal, setIsViewMediaModal] = useState(false)
  const [content, setContent] = useState<ContentDto>()

  const handleClickOnItem = (item: ContentDto) => {
    setIsViewMediaModal(true)
    setContent(item)
  }

  return (
    <div className="max-h-[65vh] justify-center overflow-y-scroll">
      <VaultMediaModal
        content={content}
        isViewMediaModal={isViewMediaModal}
        setIsViewMediaModal={setIsViewMediaModal}
      />

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
                {!deletedItems.some((x) => x.contentId === arg.contentId) && (
                  <VaultMediaItem
                    content={arg}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    isVideoSelected={isVideoSelected}
                    isMaxFileCountSelected={isMaxFileCountSelected}
                    handleClickOnItem={handleClickOnItem}
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
