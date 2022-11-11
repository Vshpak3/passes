import {
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import classNames from "classnames"
import { FC, useState } from "react"
import { MdSource } from "react-icons/md"

import { ContentService } from "src/helpers/content"

interface PassMediaProps {
  passHolderId?: string
  passId: string
  imageType: PassDtoImageTypeEnum
  animationType?: PassDtoAnimationTypeEnum
  isPinnedPass?: boolean
}

export const PassMedia: FC<PassMediaProps> = ({
  passId,
  passHolderId,
  imageType,
  animationType,
  isPinnedPass = false
}) => {
  const [shouldUsePlaceholder, setShouldUsePlaceholder] = useState(true)

  const handleLoadingAsset = () => {
    setShouldUsePlaceholder(false)
  }

  if (shouldUsePlaceholder) {
    return (
      <div
        className={classNames(
          isPinnedPass ? "w-[274px]" : "mx-auto max-w-[240px]",
          "pt-[100%] h-0 w-full rounded-lg bg-black from-passes-purple-100 via-[#F03368] to-[#F6B103]"
        )}
      />
    )
  }

  if (passHolderId) {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          onLoad={handleLoadingAsset}
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
          onLoad={handleLoadingAsset}
          src={ContentService.passAnimationPath(passId, animationType)}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        alt="no media exists"
        onLoad={handleLoadingAsset}
        src={ContentService.passImagePath(passId, imageType)}
      />
    )
  }
}
