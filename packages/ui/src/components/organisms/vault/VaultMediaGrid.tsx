import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDto,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryResponseDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { FC, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"

const VaultMediaItem = dynamic(
  import("src/components/molecules/vault/VaultMedia"),
  { ssr: false }
)
const MediaModal = dynamic(
  () => import("src/components/organisms/MediaModal"),
  {
    ssr: false
  }
)

interface VaultMediaGridProps {
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  order: GetVaultQueryRequestDtoOrderEnum
  category?: VaultCategory
  type?: VaultType
  deletedItems: ContentDto[]
  isMaxFileCountSelected: boolean
}

export const VaultMediaGrid: FC<VaultMediaGridProps> = ({
  selectedItems,
  setSelectedItems,
  category,
  type,
  order,
  deletedItems,
  isMaxFileCountSelected
}) => {
  const [isViewMediaModal, setIsViewMediaModal] = useState(false)
  const [content, setContent] = useState<ContentDto>()

  const handleClickOnItem = (item: ContentDto) => {
    setIsViewMediaModal(true)
    setContent(item)
  }

  return (
    <div className="max-h-[75vh] min-w-fit justify-center overflow-y-scroll">
      <MediaModal
        file={{ content }}
        isOpen={isViewMediaModal}
        setOpen={setIsViewMediaModal}
      />
      <div>
        <InfiniteScrollPagination<ContentDto, GetVaultQueryResponseDto>
          KeyedComponent={({ arg }: ComponentArg<ContentDto>) => {
            return (
              <>
                {!deletedItems.some((x) => x.contentId === arg.contentId) && (
                  <VaultMediaItem
                    content={arg}
                    handleClickOnItem={handleClickOnItem}
                    isMaxFileCountSelected={isMaxFileCountSelected}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                )}
              </>
            )
          }}
          className="mt-[25px] grid grid-cols-3 gap-x-[20px] gap-y-[5px] pb-20 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          emptyElement={
            <>
              <div className="col-span-1 w-[115px] md:w-[320px]" />
              <div className="col-span-1 w-[115px] md:w-[320px]" />
              <div className="col-span-1 w-[115px] md:w-[320px]" />
            </>
          }
          fetch={async (req: GetVaultQueryRequestDto) => {
            const api = new ContentApi()
            return await api.getVaultContent({
              getVaultQueryRequestDto: req
            })
          }}
          fetchProps={{ category, type, order }}
          keyValue="vault"
        />
      </div>
    </div>
  )
}
