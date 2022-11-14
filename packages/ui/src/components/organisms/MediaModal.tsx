import { ContentDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { ContentCarousel } from "src/components/organisms/content/ContentCarousel"
import { Modal } from "src/components/organisms/Modal"
import { Media } from "src/components/organisms/profile/main-content/new-post/Media"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/MediaFile"
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
  // const width = window.innerWidth - 100
  // const height = window.innerHeight - 100
  const [width, setWidth] = useState<number>(window.innerWidth - 25)
  const [height, setHeight] = useState<number>(window.innerHeight - 25)
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - 25)
      setHeight(window.innerHeight - 25)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Modal
      bare
      childrenClassname={childrenClassname}
      closable
      closableOnScreen
      isCloseOutside
      isOpen={isOpen}
      mobileFixed
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
          contentHeight={height}
          contentWidth={width}
          file={file.file}
          objectFit="contain"
          preview
        />
      )}
      {file.content && !carouselContent && (
        <Media
          className="m-0 rounded-[6px] p-0"
          contentHeight={height}
          contentWidth={width}
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
