import React from "react"
import { Button } from "src/components/atoms/Button"
import { ContentService } from "src/helpers/content"
import { downloadFile } from "src/helpers/downloadFile"

export const DownloadW9FormButton = () => {
  return (
    <Button
      onClick={() => downloadFile(ContentService.w9PublicPdfPath(), "w9.pdf")}
      variant="primary"
      style={{
        background: "rgba(255, 254, 255, 0.15)",
        fontWeight: "bold",
        width: "100%",
        color: "white"
      }}
    >
      Download W9 Form
    </Button>
  )
}
