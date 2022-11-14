import { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from "react"
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form"

import { DragDropFile } from "src/components/molecules/DragDropFile"
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_COUNT } from "src/config/media-limits"
import { ContentFile } from "src/hooks/useMedia"
import { MediaSectionReorder } from "./MediaSectionReorder"

interface MediaSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  errors: Partial<FieldErrorsImpl>
  addNewMedia: (newFiles: FileList | null) => void
  files: ContentFile[]
  onRemove: (index: number, e: MouseEvent<HTMLDivElement>) => void
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
  isPaid: boolean
  mediaPreviewIndex: number
  setMediaPreviewIndex?: (index: number) => void
  dragDisabled?: boolean
}

export const MediaSection: FC<MediaSectionProps> = ({
  register,
  errors,
  addNewMedia,
  files,
  setFiles,
  onRemove,
  isPaid,
  mediaPreviewIndex,
  setMediaPreviewIndex = () => null,
  dragDisabled = false
}) => {
  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addNewMedia(event.target.files)
    event.target.value = ""
  }

  return (
    <div className="pt-5">
      {files.length === 0 ? (
        <DragDropFile
          accept={ACCEPTED_MEDIA_TYPES}
          className="h-[170px]"
          errors={errors}
          helperText={`You may upload up to ${MAX_FILE_COUNT} pictures/videos per post`}
          multiple
          name="drag-drop"
          options={{ onChange: onFileInputChange }}
          register={register}
        />
      ) : (
        <MediaSectionReorder
          addNewMedia={addNewMedia}
          dragDisabled={dragDisabled}
          errors={errors}
          files={files}
          isPaid={isPaid}
          mediaPreviewIndex={mediaPreviewIndex}
          onRemove={onRemove}
          register={register}
          setFiles={setFiles}
          setMediaPreviewIndex={setMediaPreviewIndex}
        />
      )}
    </div>
  )
}
