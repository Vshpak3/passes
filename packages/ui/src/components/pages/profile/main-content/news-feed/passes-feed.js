import React, { useEffect, useState } from "react"
import { SelectPassFilter } from "src/components/atoms/passes/MyPass"
import PassCard from "src/components/molecules/passes/Card"
import { usePasses } from "src/hooks"

const PassesFeed = ({ profile }) => {
  const { passType, creatorPasses, setPassType } = usePasses(profile.userId)
  const [filteredPasses, setFilteredPasses] = useState([])

  useEffect(() => {
    if (passType && creatorPasses?.length > 0)
      setFilteredPasses(
        creatorPasses.filter(
          (pass) => passType === "all" || passType === pass.type
        )
      )
  }, [passType, creatorPasses])

  return (
    <>
      <div className="mt-[34px]">
        <SelectPassFilter setPassType={setPassType} />
      </div>
      <div className="mt-[25px] grid grid-cols-2  gap-[25px] pb-20 sidebar-collapse:grid-cols-3">
        {filteredPasses.length === 0 && <h1>No Pass to show</h1>}
        {filteredPasses.map((pass, i) => (
          <PassCard key={i} pass={pass} />
        ))}
      </div>
    </>
  )
}

export default PassesFeed
