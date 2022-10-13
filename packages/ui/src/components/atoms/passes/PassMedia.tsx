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
}: PassMediaProps) => {
  if (passHolderId) {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          src={ContentService.passHolderAnimation(
            passId,
            passHolderId,
            animationType
          )}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        src={ContentService.passHolderImage(passId, passHolderId, imageType)}
        alt="no media exists"
      />
    )
  } else {
    return animationType ? (
      <video autoPlay loop muted>
        <source
          src={ContentService.passAnimation(passId, animationType)}
          type="video/mp4"
        />
      </video>
    ) : (
      <img
        src={ContentService.passImage(passId, imageType)}
        alt="no media exists"
      />
    )
  }
}
