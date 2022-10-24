import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { MediaSection } from "src/components/organisms/MediaSection"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"
import { ContentService } from "src/helpers/content"
import { useMedia } from "src/hooks/useMedia"

interface VaultProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
}

export type VaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type VaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

const MAX_FILE_COUNT = 10

const checkDifferentTypesSelected = (selectedItems: ContentDto[]) => {
  const typesSelected: string[] = []

  selectedItems.forEach((item) => {
    if (!typesSelected.find((el) => el === item.contentType)) {
      typesSelected.push(item.contentType)
    }
  })
  return typesSelected.length > 1
}

export interface VaultForm {
  "drag-drop": File[]
}

export const Vault: FC<VaultProps> = ({ passSelectedItems }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm<VaultForm>()
  const [selectedItems, setSelectedItems] = useState<Array<ContentDto>>([])
  const [deletedItems, setDeletedItems] = useState<Array<ContentDto>>([])
  const [vaultType, setVaultType] = useState<VaultType>()
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>()
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )
  const [isVideoSelected, setIsVideoSelected] = useState(false)
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const [isDiffTypesSelected, setIsDiffTypesSelected] = useState(false)
  const { files, setFiles, addNewMedia, onRemove } = useMedia()

  useEffect(() => {
    if (!selectedItems.length) {
      setIsVideoSelected(false)
      setIsDiffTypesSelected(false)
      setIsMaxFileCountSelected(false)
      return
    }

    // check if video file is selected
    setIsVideoSelected(
      !!selectedItems.find((elem) => elem.contentType === "video")
    )

    // check different types
    setIsDiffTypesSelected(checkDifferentTypesSelected(selectedItems))

    // check max file count
    setIsMaxFileCountSelected(selectedItems.length === MAX_FILE_COUNT)
  }, [selectedItems])

  const setItems = (items: ContentDto[]) => {
    setSelectedItems(items)
    if (passSelectedItems) {
      passSelectedItems(items)
    }
  }
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

  const onSubmit = async () => {
    await new ContentService()
      .uploadContent(files, undefined, {
        inPost: false,
        inMessage: false
      })
      .then(() => toast.success("Files added successfully"))
      .catch((error) => toast.error(error))
    setValue("drag-drop", [])
    reset()
    setFiles([])
  }
  return (
    <div className="mx-auto w-full px-2 md:px-5 sidebar-collapse:max-w-[1100px]">
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
          isDiffTypesSelected={isDiffTypesSelected}
        />

        <VaultMediaGrid
          selectedItems={selectedItems}
          setSelectedItems={setItems}
          deletedItems={deletedItems}
          order={order}
          category={vaultCategory}
          type={vaultType}
          isVideoSelected={isVideoSelected}
          isMaxFileCountSelected={isMaxFileCountSelected}
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
      </form>
    </div>
  )
}
