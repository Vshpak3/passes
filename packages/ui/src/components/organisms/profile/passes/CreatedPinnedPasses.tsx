import { FC } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
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
          <SectionTitle>Featured</SectionTitle>
          <div className=" w-full items-center px-4">
            {pinnedPasses?.map((pass) => (
              <div className="py-2" key={pass.passId}>
                <PassCard key={pass.passId} pass={pass} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
