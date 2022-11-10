import { FC } from "react"

import {
  PassesSectionTitle,
  PassFormError
} from "src/components/atoms/passes/CreatePass"
import { DragDropFile } from "src/components/molecules/DragDropFile"
import { PassFilePreview } from "./PassFilePreview"

interface PassFileUploadProps {
  errors: any // eslint-disable-line @typescript-eslint/no-explicit-any
  fileUploadError: any // eslint-disable-line @typescript-eslint/no-explicit-any
  files: any // eslint-disable-line @typescript-eslint/no-explicit-any
  onDragDropChange: any // eslint-disable-line @typescript-eslint/no-explicit-any
  onRemoveFileUpload: any // eslint-disable-line @typescript-eslint/no-explicit-any
  register: any // eslint-disable-line @typescript-eslint/no-explicit-any
  isPreview: any // eslint-disable-line @typescript-eslint/no-explicit-any
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
    <div className="h-full w-full items-center pb-2">
      <div className="mb-3">
        <PassesSectionTitle title="Upload an image" />
      </div>
      {files.length ? (
        <PassFilePreview files={files} onRemove={onRemoveFileUpload} />
      ) : (
        <DragDropFile
          accept={["image", "video"]}
          className="h-[200px]"
          errors={errors}
          helperText="you may upload 1 image of your choice as art work for your pass. If
          no image is uploaded, a default will be selected"
          multiple={false}
          name="passFile"
          options={{ onChange: onDragDropChange }}
          register={register}
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
