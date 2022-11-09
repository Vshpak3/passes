import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { MediaSection } from "src/components/organisms/MediaSection"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"
import { MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentService } from "src/helpers/content"
import { useMedia } from "src/hooks/useMedia"

interface VaultProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
  scroll?: boolean
}

export type VaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type VaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

interface VaultFormProps {
  "drag-drop": File[]
}

export const Vault: FC<VaultProps> = ({
  passSelectedItems,
  scroll = false
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
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
      .then(() =>
        toast.success(
          "Files added successfully. They will appear in Vault when they are finished processing."
        )
      )
      .catch((error) => toast.error(error))
    setValue("drag-drop", [])
    reset()
    setFiles([])
  }

  return (
    <div className="h-full w-full px-2 md:px-5">
      <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
        <VaultNavigation
          addNewMedia={addNewMedia}
          deletedItems={deletedItems}
          embedded={!!passSelectedItems}
          order={order}
          selectedItems={selectedItems}
          setDeletedItems={setDeletedItems}
          setOrder={setOrder}
          setSelectedItems={setItems}
          setVaultCategory={setVaultCategory}
          setVaultType={setVaultType}
          vaultCategory={vaultCategory}
          vaultType={vaultType}
        />
        {!!files?.length && (
          <>
            <MediaSection
              addNewMedia={addNewMedia}
              errors={errors}
              files={files}
              isPaid={false}
              mediaPreviewIndex={0}
              onRemove={onRemove}
              register={register}
              setFiles={setFiles}
              setMediaPreviewIndex={() => null}
            />
            <Button
              className="my-[10px] w-fit"
              disabled={isSubmitting}
              type={ButtonTypeEnum.SUBMIT}
              variant="pink"
            >
              Save to Vault
            </Button>
          </>
        )}
        <VaultMediaGrid
          category={vaultCategory}
          deletedItems={deletedItems}
          isMaxFileCountSelected={isMaxFileCountSelected}
          order={order}
          scroll={scroll}
          selectedItems={selectedItems}
          setSelectedItems={setItems}
          type={vaultType}
        />
      </form>
    </div>
  )
}
