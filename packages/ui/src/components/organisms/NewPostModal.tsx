import React, { Dispatch, FC, SetStateAction } from "react"
import { Modal } from "src/components/organisms/Modal"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/media"

interface NewPostModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  file: File
  modalContainerClassname?: string
  childrenClassname?: string
}

export const NewPostModal: FC<NewPostModalProps> = ({
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
