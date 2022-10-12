import { FC, useState } from "react"
import { ContentService } from "src/helpers/content"

interface PassMediaProps {
  passHolderId?: string
  passId: string
}
enum PassMediaState {
  HOLDER_VIDEO,
  HOLDER_IMAGE,
  PASS_VIDEO,
  PASS_IMAGE
}

export const PassMedia: FC<PassMediaProps> = ({
  passId,
  passHolderId
}: PassMediaProps) => {
  const [state, setState] = useState<PassMediaState>(
    passHolderId ? PassMediaState.HOLDER_VIDEO : PassMediaState.PASS_VIDEO
  )
  switch (state) {
    case PassMediaState.HOLDER_VIDEO:
      return (
        <video
          autoPlay
          loop
          muted
          onError={() => setState(PassMediaState.HOLDER_IMAGE)}
        >
          <source
            src={ContentService.passHolderVideo(passId, passHolderId ?? "")}
            type="video/mp4"
          />
        </video>
      )
    case PassMediaState.HOLDER_IMAGE:
      return (
        <img
          src={ContentService.passHolderImage(passId, passHolderId ?? "")}
          onError={() => setState(PassMediaState.PASS_VIDEO)}
          alt="no media exists"
        />
      )
    case PassMediaState.PASS_VIDEO:
      return (
        <video
          autoPlay
          loop
          muted
          onError={() => setState(PassMediaState.PASS_IMAGE)}
        >
          <source src={ContentService.passVideo(passId)} type="video/mp4" />
        </video>
      )
    case PassMediaState.PASS_IMAGE:
      return (
        <img src={ContentService.passImage(passId)} alt="no media exists" />
      )
  }
}
