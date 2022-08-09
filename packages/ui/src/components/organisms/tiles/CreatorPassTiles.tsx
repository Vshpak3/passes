import React, { useEffect, useState } from "react"

interface ICreatorPassTiles {
  passData: {
    passName: string
    creatorName: string
    cost: string
    imgUrl: string
  }
}

const CreatorPassTiles = ({ passData }: ICreatorPassTiles) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  } else
    return (
      <div
        className="min-h-[213px] min-w-[260px] rounded bg-white p-4"
        style={{
          backgroundImage: `url(${passData.imgUrl})`,
          backgroundSize: "cover"
        }}
      >
        <div>
          <span className="text-2xl font-bold text-[#ffff]/90">
            {passData.passName}
          </span>
        </div>
        <div>
          <span className="text-[#ffff]/90">${passData.cost} / month</span>
        </div>
      </div>
    )
}

export default CreatorPassTiles
