import { FC, MouseEvent } from "react"

import { FormInput } from "src/components/atoms/FormInput"
import {
  PassesSectionTitle,
  PassFormError
} from "src/components/atoms/passes/CreatePass"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/Media"

interface PassFilesProps {
  files: File[]
  onRemove: (value: number) => void
}

interface PassFileProps {
  file: File
  onRemove: (e: MouseEvent<HTMLDivElement>) => void
  gridLayout: "col-span-12" | "md:col-span-6" | "md:col-span-4"
}

const PassFile = ({ onRemove, file, gridLayout }: PassFileProps) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <MediaFile
      isPassUpload
      className="ml-[30px]"
      contentHeight={200}
      contentWidth={130}
      onRemove={onRemove}
      file={file}
    />
  </div>
)

const composeMediaGridLayout = (length: number, index: number) => {
  switch (length) {
    case 1:
      return "col-span-12"
    case 2:
      // eslint-disable-next-line sonarjs/no-duplicate-string
      return "md:col-span-6"
    case 4:
      return "md:col-span-6"
    case 3:
      return "md:col-span-6"
    case 5:
      return index === 0 || index === 1 ? "md:col-span-6" : "md:col-span-4"
    default:
      return "md:col-span-4"
  }
}

const PassFilePreview: FC<PassFilesProps> = ({ files, onRemove }) => {
  const renderFilePreview = files.map((file: File, index: number) => {
    const gridLayout = composeMediaGridLayout(files.length, index)
    const onRemoveFile = () => onRemove(index)
    return (
      <PassFile
        key={`media_${index}`}
        onRemove={onRemoveFile}
        file={file}
        gridLayout={gridLayout}
      />
    )
  })

  return (
    <div className="min-h-[300px] w-full">
      <div className="flex grid h-full grid-cols-12 items-start justify-start gap-4">
        {files.length > 0 && renderFilePreview}
      </div>
    </div>
  )
}

interface PassFileUploadProps {
  errors: any
  fileUploadError: any
  files: any
  onDragDropChange: any
  onRemoveFileUpload: any
  register: any
  isPreview: any
}

export const PassFileUpload: FC<PassFileUploadProps> = ({
  errors,
  fileUploadError,
  files,
  onDragDropChange,
  onRemoveFileUpload,
  register,
  isPreview
}) => {
  return (
    <div className="overflow-y-full h-full w-full items-center pb-2">
      <div className="mb-3">
        <PassesSectionTitle title="Upload an image" />
      </div>
      {files.length ? (
        <>
          <PassFilePreview files={files} onRemove={onRemoveFileUpload} />
        </>
      ) : (
        <FormInput
          className="h-[200px]"
          register={register}
          name="passFile"
          type="drag-drop-file"
          multiple={false}
          accept={["image", "video"]}
          options={{ onChange: onDragDropChange }}
          errors={errors}
          helperText="you may upload 1 image of your choice as art work for your pass. If
          no image is uploaded, a default will be selected"
          // maximumLimit={maximumLimit}
        />
      )}
      {isPreview && (
        <div className="mt-4">
          <span className="text-[#ffff]/30">Upload Preview</span>
        </div>
      )}
      {fileUploadError && (
        <PassFormError className="mt-3" message={fileUploadError} />
      )}
    </div>
  )
}
