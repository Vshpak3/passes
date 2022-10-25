import { FC } from "react"

import {
  MediaContent,
  MediaContentProps
} from "src/components/molecule/profile/post/MediaContent"

interface MediaProps extends MediaContentProps {
  isProcessing: boolean
  autoplayVideo?: boolean
}

export const Media: FC<MediaProps> = ({
  contents = [],
  isProcessing,
  autoplayVideo
}) => {
  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative mb-[30px] rounded-md border border-passes-purple-100 px-[25px] py-[15px]">
          Your content is being processed.
        </div>
      ) : (
        <MediaContent contents={contents} autoplayVideo={autoplayVideo} />
      )}
    </div>
  )
}
