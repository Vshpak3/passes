import { Dispatch, FC, MouseEvent, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { MediaSection } from "src/components/organisms/MediaSection"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"

interface VaultFormProps {
  "drag-drop": File[]
}

interface VaultMediaUploadProps {
  files: ContentFile[]
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
  addNewMedia: (files: FileList | null) => void
}

export const VaultMediaUpload: FC<VaultMediaUploadProps> = ({
  files,
  onRemove,
  setFiles,
  addNewMedia
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<VaultFormProps>()

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
    <>
      {!!files?.length && (
        <form className="max-w-[500px]" onSubmit={handleSubmit(onSubmit)}>
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
          >
            Save to Vault
          </Button>
        </form>
      )}
    </>
  )
}
