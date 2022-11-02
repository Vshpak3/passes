import { ContentDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"

import { ContentCarousel } from "src/components/organisms/content/ContentCarousel"
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
  carouselContent?: ContentDto[]
  activeIndex?: number
}

export const MediaModal: FC<ModalProps> = ({
  isOpen,
  setOpen,
  file,
  modalContainerClassname,
  childrenClassname,
  carouselContent,
  activeIndex = 0
}) => {
  carouselContent = undefined // deprecate content carousel for now
  return (
    <Modal
      childrenClassname={childrenClassname}
      isCloseOutside
      isNewPost
      isOpen={isOpen}
      modalContainerClassname={modalContainerClassname}
      setOpen={setOpen}
    >
      {carouselContent && (
        <div className="max-w-[900px]">
          <ContentCarousel
            activeIndex={activeIndex}
            contents={carouselContent}
          />
        </div>
      )}
      {file.file && !carouselContent && (
        <MediaFile
          className="m-0 rounded-[6px] p-0"
          contentHeight={800}
          contentWidth={800}
          file={file.file}
          objectFit="contain"
          preview
        />
      )}
      {file.content && !carouselContent && (
        <Media
          className="m-0 rounded-[6px] p-0"
          contentHeight={800}
          contentWidth={800}
          objectFit="contain"
          preview
          src={ContentService.userContentMediaPath(file.content)}
          type={file.content.contentType}
        />
      )}
    </Modal>
  )
}

export default MediaModal // eslint-disable-line import/no-default-export
