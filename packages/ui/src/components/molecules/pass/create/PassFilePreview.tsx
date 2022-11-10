import { FC } from "react"

import { PassFile } from "./PassFile"

interface PassFilesProps {
  files: File[]
  onRemove: (value: number) => void
}

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

export const PassFilePreview: FC<PassFilesProps> = ({ files, onRemove }) => {
  const renderFilePreview = files.map((file: File, index: number) => {
    const gridLayout = composeMediaGridLayout(files.length, index)
    const onRemoveFile = () => onRemove(index)
    return (
      <PassFile
        file={file}
        gridLayout={gridLayout}
        key={`media_${index}`}
        onRemove={onRemoveFile}
      />
    )
  })

  return (
    <div className="min-h-[300px] w-full">
      <div className="grid h-full grid-cols-12 items-start justify-start gap-4">
        {files.length > 0 && renderFilePreview}
      </div>
    </div>
  )
}
