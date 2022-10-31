import { FC } from "react"

import { PassCard } from "src/components/molecules/pass/PassCard"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

interface CreatorPinnedPassesProps {
  userId: string
}

export const CreatorPinnedPasses: FC<CreatorPinnedPassesProps> = ({
  userId
}) => {
  const { isTablet } = useWindowSize()
  const { pinnedPasses } = useCreatorPinnedPasses(userId)

  return (
    <>
      {!isTablet && (
        <div className="flex flex-col px-4">
          <span className="py-5 text-lg font-bold">Pinned Passes</span>
          <div className=" w-full items-center px-4">
            {pinnedPasses?.map((pass) => (
              <div className="py-2" key={pass.passId}>
                <PassCard pass={pass} key={pass.passId} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
