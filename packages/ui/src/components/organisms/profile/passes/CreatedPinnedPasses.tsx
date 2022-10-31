import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { FC } from "react"

import { PassCard } from "src/components/molecules/pass/PassCard"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"

interface CreatorPinnedPassesProps {
  userId: string
}

export const CreatorPinnedPasses: FC<CreatorPinnedPassesProps> = ({
  userId
}) => {
  const { pinnedPasses } = useCreatorPinnedPasses(userId)

  return (
    <div className="flex flex-col px-4">
      <span className="py-5 text-lg font-bold">Creator&apos;s Passes</span>
      <div className="hidden w-full items-center rounded-lg border border-[#ffffff]/10 bg-[#1b141d]/50 px-4 py-4 backdrop-blur-[100px] lg:m-0 lg:flex lg:flex-col lg:items-center">
        <span className="mb-5 text-base font-bold text-[#ffff]/90 lg:mb-0 lg:self-start">
          Pass Types
        </span>
        <div className="overflow-x-none relative mx-0 mt-4 flex flex-col items-start">
          {pinnedPasses?.map((pass) => (
            <PassCard pass={pass} key={pass.passId} />
          ))}
        </div>
      </div>
    </div>
  )
}
