import { ContentDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"
import { Modal } from "src/components/organisms/Modal"
import { ContentService } from "src/helpers/content"

import { VaultVideo } from "./VaultVideo"

interface VaultMediaModalProps {
  content?: ContentDto
  isViewMediaModal: boolean
  setIsViewMediaModal: Dispatch<SetStateAction<boolean>>
}

export const VaultMediaModal: FC<VaultMediaModalProps> = ({
  content,
  isViewMediaModal,
  setIsViewMediaModal
}) => {
  return (
    <Modal
      isOpen={isViewMediaModal}
      setOpen={setIsViewMediaModal}
      shouldCloseOnClickOutside={true}
    >
      <div className="flex flex-row justify-center">
        {content && content.contentType === "image" && (
          <img
            src={ContentService.userContentThumbnail(content)}
            className="min-w-[500px] max-w-[500px] object-cover drop-shadow-profile-photo"
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = "/img/profile/default-profile-img.svg"
            }}
          />
        )}

        {content && content.contentType === "video" && (
          <VaultVideo videoUrl={ContentService.userContentMedia(content)} />
        )}
      </div>
    </Modal>
  )
}
