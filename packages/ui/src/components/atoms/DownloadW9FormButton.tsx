import React from "react"

import { Button } from "src/components/atoms/button/Button"
import { ContentService } from "src/helpers/content"
import { downloadFile } from "src/helpers/downloadFile"

export const DownloadW9FormButton = () => {
  return (
    <Button
      className="w-full bg-gray-100 font-bold"
      onClick={() => downloadFile(ContentService.w9PublicPdfPath(), "w9.pdf")}
      variant="primary"
    >
      Download W9 Form
    </Button>
  )
}
