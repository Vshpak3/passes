import { FC } from "react"
import { SelectPassFilter } from "src/components/atoms/passes/MyPass"
import { PassCard } from "src/components/molecules/pass/Card"
import { usePasses } from "src/hooks/usePasses"
import { useProfile } from "src/hooks/useProfile"

export const PassesFeed: FC = () => {
  const { profileUserId } = useProfile()

  const { passType, setPassType, filteredCreatorPassesList } = usePasses(
    profileUserId || ""
  )

  return (
    <>
      <div className="mt-[34px]">
        <SelectPassFilter setPassType={setPassType} passType={passType} />
      </div>
      <div className="mt-[25px] grid grid-cols-2 gap-[25px] pb-20 sidebar-collapse:grid-cols-3">
        {filteredCreatorPassesList.length === 0 && <span>No Pass to show</span>}
        {filteredCreatorPassesList.map((pass, i) => (
          <PassCard key={i} pass={pass} />
        ))}
      </div>
    </>
  )
}
