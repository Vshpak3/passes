import React, { Dispatch, SetStateAction } from "react"
import { Modal } from "src/components/organisms/Modal"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/media"

interface NewPostModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  file: File
  modalContainerClassname?: string
  childrenClassname?: string
}

export const NewPostModal = ({
  isOpen,
  setOpen,
  file,
  modalContainerClassname,
  childrenClassname
}: NewPostModalProps) => {
  return (
    <Modal
      isNewPost
      isOpen={isOpen}
      setOpen={setOpen}
      modalContainerClassname={modalContainerClassname}
      childrenClassname={childrenClassname}
    >
      <MediaFile
        preview
        file={file}
        className="m-0 rounded-[6px] p-0"
        contentHeight={545}
        contentWidth={400}
      />
    </Modal>
  )
}
