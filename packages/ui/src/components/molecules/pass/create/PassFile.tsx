import { FC, MouseEvent } from "react"

import { Media } from "src/components/organisms/profile/main-content/new-post/Media"

interface PassFileProps {
  file: File
  onRemove: (e: MouseEvent<HTMLDivElement>) => void
  gridLayout: "col-span-12" | "md:col-span-6" | "md:col-span-4"
}

export const PassFile: FC<PassFileProps> = ({ onRemove, file, gridLayout }) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <Media
      className="ml-[30px]"
      contentFile={{ file: file }}
      contentHeight={200}
      contentWidth={130}
      isPassUpload
      onRemove={onRemove}
    />
  </div>
)
