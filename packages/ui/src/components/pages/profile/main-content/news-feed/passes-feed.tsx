import { PassDto } from "@passes/api-client"
import React, { useEffect, useState } from "react"
import { SelectPassFilter } from "src/components/atoms/passes/MyPass"
import PassCard from "src/components/molecules/passes/Card"
import { usePasses } from "src/hooks"

const PassesFeed = ({ profile }: any) => {
  const { passType, creatorPasses, setPassType } = usePasses(profile.userId)
  const [filteredPasses, setFilteredPasses] = useState<PassDto[]>([])

  useEffect(() => {
    if (passType && creatorPasses?.length > 0) {
      setFilteredPasses(
        creatorPasses.filter(
          (pass) => passType === "all" || passType === pass.type
        )
      )
    }
  }, [passType, creatorPasses])

const PassesFeed = ({ profile }: any) => {
  const { passType, setPassType, filteredCreatorPassesList } = usePasses(
    profile.userId
  )

  return (
    <>
      <div className="mt-[34px]">
        <SelectPassFilter setPassType={setPassType} passType={passType} />
      </div>
      <div className="mt-[25px] grid grid-cols-2  gap-[25px] pb-20 sidebar-collapse:grid-cols-3">
        {filteredCreatorPassesList.length === 0 && <span>No Pass to show</span>}
        {filteredCreatorPassesList.map((pass, i) => (
          <PassCard key={i} pass={pass} />
        ))}
      </div>
    </>
  )
}

export default PassesFeed
