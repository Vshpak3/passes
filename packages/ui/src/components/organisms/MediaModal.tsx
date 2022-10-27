import React, { Dispatch, FC, SetStateAction } from "react"

import { Modal } from "src/components/organisms/Modal"
import {
  Media,
  MediaFile
} from "src/components/organisms/profile/main-content/new-post/Media"
import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"

interface ModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  file: ContentFile
  modalContainerClassname?: string
  childrenClassname?: string
}

export const MediaModal: FC<ModalProps> = ({
  isOpen,
  setOpen,
  file,
  modalContainerClassname,
  childrenClassname
}) => {
  return (
    <Modal
      isNewPost
      isOpen={isOpen}
      setOpen={setOpen}
      modalContainerClassname={modalContainerClassname}
      childrenClassname={childrenClassname}
      isCloseOutside
    >
      {file.file && (
        <MediaFile
          preview
          file={file.file}
          className="m-0 rounded-[6px] p-0"
          contentHeight={800}
          contentWidth={800}
          objectFit="contain"
        />
      )}
      {file.content && (
        <Media
          src={ContentService.userContentMediaPath(file.content)}
          preview={true}
          type={file.content.contentType}
          contentWidth={800}
          contentHeight={800}
          className="m-0 rounded-[6px] p-0"
          objectFit="contain"
        />
      )}
    </Modal>
  )
}

export default MediaModal // eslint-disable-line import/no-default-export
