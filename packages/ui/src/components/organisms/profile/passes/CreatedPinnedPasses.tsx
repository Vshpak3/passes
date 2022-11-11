import { FC, useContext } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { PassCard } from "src/components/molecules/pass/PassCard"
import { ProfileContext } from "src/pages/[username]"

export const CreatorPinnedPasses: FC = () => {
  const { pinnedPasses } = useContext(ProfileContext)
  return (
    <div className="flex flex-col px-4">
      <div className="pl-2">
        <SectionTitle>Featured</SectionTitle>
      </div>
      <div className="w-full items-center px-4">
        {pinnedPasses?.map((pass) => (
          <div className="py-2" key={pass.passId}>
            <PassCard isPinnedPass key={pass.passId} pass={pass} />
          </div>
        ))}
      </div>
    </div>
  )
}
