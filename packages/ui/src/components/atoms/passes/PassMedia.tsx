import {
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
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
  const [shouldUsePlaceholder, setShouldUsePlaceholder] = useState(false)

  const handleErrorLoadingAsset = () => {
    setShouldUsePlaceholder(true)
  }

  if (shouldUsePlaceholder) {
    return (
      <div className="h-[200px] w-full rounded-lg bg-gradient-to-br from-passes-purple-100 via-[#F03368] to-[#F6B103]" />
    )
  }

  if (passHolderId) {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          onError={handleErrorLoadingAsset}
          src={ContentService.passHolderAnimationPath(
            passId,
            passHolderId,
            animationType
          )}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        alt="no media exists"
        src={ContentService.passHolderImagePath(
          passId,
          passHolderId,
          imageType
        )}
      />
    )
  } else {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          onError={handleErrorLoadingAsset}
          src={ContentService.passAnimationPath(passId, animationType)}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        alt="no media exists"
        onError={handleErrorLoadingAsset}
        src={ContentService.passImagePath(passId, imageType)}
      />
    )
  }
}
