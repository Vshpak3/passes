import {
  PassDtoAnimationTypeEnum,
  PassDtoImageTypeEnum
} from "@passes/api-client"
import { FC } from "react"
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
  if (passHolderId) {
    return animationType ? (
      <video autoPlay loop muted>
        <source
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
        src={ContentService.passHolderImagePath(
          passId,
          passHolderId,
          imageType
        )}
        alt="no media exists"
      />
    )
  } else {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          src={ContentService.passAnimationPath(passId, animationType)}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        src={ContentService.passImagePath(passId, imageType)}
        alt="no media exists"
      />
    )
  }
}
