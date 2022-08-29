import React from "react"
import { CreatorPassTiles } from "src/components/organisms"

const CreatorPasses = ({ passes, title, alternateBg = false }) => {
  const renderPassesGrid = passes?.map((pass, index) => (
    <CreatorPassTiles key={index} alternateBg={alternateBg} passData={pass} />
  ))

  return (
    <>
      <div className="mt-4 mb-2 flex gap-x-4">
        <span className="text-[24px] font-bold text-[#ffff]/90">{title}</span>
        <hr className="my-auto grow border-[#2C282D]" />
      </div>
      <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2 sidebar-collapse:grid-cols-3">
        {renderPassesGrid}
      </div>
    </>
  )
}

export { CreatorPasses }
