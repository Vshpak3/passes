import {
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import classNames from "classnames"
import { FC, useState } from "react"

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

  if (animationType) {
    const animationPath = passHolderId
      ? ContentService.passHolderAnimationPath(
          passId,
          passHolderId,
          animationType
        )
      : ContentService.passAnimationPath(passId, animationType)
    return (
      <>
        <video
          autoPlay
          className={classNames(shouldUsePlaceholder ? "hidden" : "")}
          loop
          muted
          onLoadedData={handleLoadingAsset}
        >
          <source src={animationPath} type="video/mp4" />
        </video>
        {shouldUsePlaceholder && placeHolder}
      </>
    )
  } else {
    const imagePath = passHolderId
      ? ContentService.passHolderImagePath(passId, passHolderId, imageType)
      : ContentService.passImagePath(passId, imageType)
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
