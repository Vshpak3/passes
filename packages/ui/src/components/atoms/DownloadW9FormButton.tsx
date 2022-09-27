import React from "react"
import { Button } from "src/components/atoms"
import { downloadFile } from "src/helpers"

const DownloadW9FormButton = () => {
  return (
    <Button
      onClick={() =>
        downloadFile(
          `${process.env.NEXT_PUBLIC_CDN_URL}/assets/w9.pdf`,
          "w9.pdf"
        )
      }
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

export default DownloadW9FormButton
