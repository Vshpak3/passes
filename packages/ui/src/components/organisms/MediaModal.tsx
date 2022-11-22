import { ContentDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { ContentCarousel } from "src/components/organisms/content/ContentCarousel"
import { Dialog } from "src/components/organisms/Dialog"
import { Media } from "src/components/organisms/profile/main-content/new-post/Media"
import { ContentFile } from "src/hooks/useMedia"

interface ModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  contentFile: ContentFile
  modalContainerClassname?: string
  carouselContent?: ContentDto[]
  activeIndex?: number
}

export const MediaModal: FC<ModalProps> = ({
  isOpen,
  setOpen,
  contentFile,
  modalContainerClassname,
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
    <Dialog
      className={modalContainerClassname}
      onClose={() => setOpen(false)}
      open={isOpen}
      withCloseButton
    >
      {carouselContent && (
        <div className="max-w-[900px]">
          <ContentCarousel
            activeIndex={activeIndex}
            contents={carouselContent}
          />
        </div>
      )}
      {!carouselContent && (
        <Media
          className="m-0 p-0"
          contentFile={contentFile}
          contentHeight={height}
          contentWidth={width}
          hidePlayButton
          objectFit="contain"
          preview
        />
      )}
    </Dialog>
  )
}
