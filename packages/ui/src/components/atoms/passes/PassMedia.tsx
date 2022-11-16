import {
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import classNames from "classnames"
import { FC, useEffect, useRef, useState } from "react"

import { ContentService } from "src/helpers/content"

interface PassMediaProps {
  passHolderId?: string
  passId: string
  imageType: PassDtoImageTypeEnum
  animationType?: PassDtoAnimationTypeEnum
}

export const PassMedia: FC<PassMediaProps> = ({
  passId,
  passHolderId,
  imageType,
  animationType
}) => {
  const [shouldUsePlaceholder, setShouldUsePlaceholder] = useState(true)

  const handleLoadingAsset = () => {
    setShouldUsePlaceholder(false)
  }

  const placeHolder = (
    <div className="h-0 w-full rounded-lg bg-black from-passes-purple-100 via-[#F03368] to-[#F6B103] pt-[100%]" />
  )

  const refVideo = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!refVideo.current) {
      return
    }

    const v = refVideo.current
    v.defaultMuted = true
    v.muted = true
  }, [refVideo])

  if (animationType) {
    const animationPath = passHolderId
      ? ContentService.passHolderMediaPath(passId, passHolderId, animationType)
      : ContentService.passMediaPath(passId, animationType)
    return (
      <>
        <video
          autoPlay
          loop
          muted
          playsInline
          // poster={animationPath}
          ref={refVideo}
        >
          <source src={animationPath} type="video/mp4" />
        </video>

        {/* TODO: placeholder image will be added as video poster; NFT thumbnail when we they get generated */}
      </>
    )
  } else {
    const imagePath = passHolderId
      ? ContentService.passHolderMediaPath(passId, passHolderId, imageType)
      : ContentService.passMediaPath(passId, imageType)
    return (
      <>
        <img
          alt="no media exists"
          className={classNames(shouldUsePlaceholder ? "hidden" : "")}
          onLoad={handleLoadingAsset}
          src={imagePath}
        />
        {shouldUsePlaceholder && placeHolder}
      </>
    )
  }
}
