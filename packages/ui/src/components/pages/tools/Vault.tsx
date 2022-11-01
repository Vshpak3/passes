import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { MediaSection } from "src/components/organisms/MediaSection"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"
import { MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
import { useMedia } from "src/hooks/useMedia"

interface VaultProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
}

export type VaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type VaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

interface VaultFormProps {
  "drag-drop": File[]
}

export const Vault: FC<VaultProps> = ({ passSelectedItems }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm<VaultFormProps>()
  const [selectedItems, setSelectedItems] = useState<Array<ContentDto>>([])
  const [deletedItems, setDeletedItems] = useState<Array<ContentDto>>([])
  const [vaultType, setVaultType] = useState<VaultType>()
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>()
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const { files, setFiles, addNewMedia, onRemove } = useMedia()

  const router = useRouter()
  const pushToMessages = () => {
    router.push(
      {
        pathname: "/messages",
        query: {
          content: JSON.stringify(
            selectedItems.map(({ contentId, contentType }) => ({
              contentId,
              contentType
            }))
          )
        }
      },
      "/messages"
    )
  }

  const setItems = (items: ContentDto[]) => {
    setSelectedItems(items)
    setIsMaxFileCountSelected(items.length === MAX_FILE_COUNT)
    if (passSelectedItems) {
      passSelectedItems(items)
    }
  }

  const onSubmit = async () => {
    await new ContentService()
      .uploadUserContent({ files })
      .then(() => toast.success("Files added successfully"))
      .catch((error) => toast.error(error))
    setValue("drag-drop", [])
    reset()
    setFiles([])
  }

  return (
    <div className="ml-4 w-full px-2 md:px-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VaultNavigation
          setFiles={setFiles}
          selectedItems={selectedItems}
          setSelectedItems={setItems}
          vaultType={vaultType}
          vaultCategory={vaultCategory}
          setVaultCategory={setVaultCategory}
          setVaultType={setVaultType}
          pushToMessages={pushToMessages}
          embedded={!!passSelectedItems}
          setOrder={setOrder}
          order={order}
          deletedItems={deletedItems}
          setDeletedItems={setDeletedItems}
        />
        {!!files?.length && (
          <>
            <MediaSection
              register={register}
              errors={errors}
              files={files}
              setFiles={setFiles}
              onRemove={onRemove}
              addNewMedia={addNewMedia}
              mediaPreviewIndex={0}
              setMediaPreviewIndex={() => null}
              isPaid={false}
            />
            <Button
              variant="pink"
              tag="button"
              type={ButtonTypeEnum.SUBMIT}
              className="my-[10px] w-fit"
            >
              Save to Vault
            </Button>
          </>
        )}
        <VaultMediaGrid
          selectedItems={selectedItems}
          setSelectedItems={setItems}
          deletedItems={deletedItems}
          order={order}
          category={vaultCategory}
          type={vaultType}
          isMaxFileCountSelected={isMaxFileCountSelected}
        />
      </form>
    </div>
  )
}
