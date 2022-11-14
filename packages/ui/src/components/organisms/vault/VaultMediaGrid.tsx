import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDto,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryResponseDto
} from "@passes/api-client"
import classNames from "classnames"
import { FC, useCallback, useMemo, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { VaultLoader } from "src/components/atoms/vault/VaultLoader"
import { VaultMediaItemCached } from "src/components/molecules/vault/VaultMediaItemCached"
import { MediaModal } from "src/components/organisms/MediaModal"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"

interface VaultMediaGridProps {
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  order: GetVaultQueryRequestDtoOrderEnum
  category?: VaultCategory
  type?: VaultType
  isMaxFileCountSelected: boolean
  scroll?: boolean
}

export const VaultMediaGrid: FC<VaultMediaGridProps> = ({
  selectedItems,
  setSelectedItems,
  category,
  type,
  order,
  isMaxFileCountSelected,
  scroll = false
}) => {
  const [isViewMediaModal, setIsViewMediaModal] = useState(false)
  const [content, setContent] = useState<ContentDto>()

  const handleClickOnItem = (item: ContentDto) => {
    setIsViewMediaModal(true)
    setContent(item)
  }

  const fetchProps = useMemo(() => {
    return {
      type,
      order,
      category
    }
  }, [category, type, order])

  const [node, setNode] = useState<HTMLDivElement>()
  const ref = useCallback((node: HTMLDivElement) => {
    setNode(node)
  }, [])

  return (
    <div
      className={classNames(
        scroll ? "h-[75%] min-w-fit justify-center overflow-y-auto" : ""
      )}
      id="scrollableDiv"
      ref={ref}
    >
      <MediaModal
        file={{ content }}
        isOpen={isViewMediaModal}
        setOpen={setIsViewMediaModal}
      />
      <InfiniteScrollPagination<ContentDto, GetVaultQueryResponseDto>
        KeyedComponent={({ arg }: ComponentArg<ContentDto>) => {
          return (
            <VaultMediaItemCached
              content={arg}
              handleClickOnItem={handleClickOnItem}
              isMaxFileCountSelected={isMaxFileCountSelected}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )
        }}
        className={classNames(
          scroll
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
          "mt-[25px] grid grid-cols-3 gap-x-[20px] gap-y-[5px] pb-20 "
        )}
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
        fetchProps={fetchProps}
        keySelector="contentId"
        keyValue="/pages/vault"
        loadingElement={VaultLoader}
        node={node}
        scrollableTarget={scroll ? "scrollableDiv" : undefined}
        style={{ height: "100%" }}
      />
    </div>
  )
}
