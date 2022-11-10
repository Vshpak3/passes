import { FC, MouseEvent } from "react"

import { MediaFile } from "src/components/organisms/profile/main-content/new-post/MediaFile"

interface PassFileProps {
  file: File
  onRemove: (e: MouseEvent<HTMLDivElement>) => void
  gridLayout: "col-span-12" | "md:col-span-6" | "md:col-span-4"
}

export const PassFile: FC<PassFileProps> = ({ onRemove, file, gridLayout }) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <MediaFile
      className="ml-[30px]"
      contentHeight={200}
      contentWidth={130}
      file={file}
      isPassUpload
      onRemove={onRemove}
    />
  </div>
)
