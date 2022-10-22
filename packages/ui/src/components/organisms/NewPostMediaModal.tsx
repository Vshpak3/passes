import React, { Dispatch, FC, SetStateAction } from "react"
import { Modal } from "src/components/organisms/Modal"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/Media"

interface NewPostModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  file: File
  modalContainerClassname?: string
  childrenClassname?: string
}

export const NewPostMediaModal: FC<NewPostModalProps> = ({
  isOpen,
  setOpen,
  file,
  modalContainerClassname,
  childrenClassname
}) => {
  const min = Math.min(Math.min(window.innerWidth, window.innerHeight), 800)
  return (
    <Modal
      isNewPost
      isOpen={isOpen}
      setOpen={setOpen}
      modalContainerClassname={modalContainerClassname}
      childrenClassname={childrenClassname}
      isCloseOutside
    >
      <MediaFile
        preview
        file={file}
        className="m-0 rounded-[6px] p-0"
        contentHeight={min}
        contentWidth={min}
        objectFit="contain"
      />
    </Modal>
  )
}
