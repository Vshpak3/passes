import React, { useEffect, useState } from "react"

interface ICreatorPassTiles {
  passData: {
    passName: string
    creatorName: string
    cost: string
  }
}

export const CreatorPassTiles = ({ passData }: ICreatorPassTiles) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  } else
    return (
      <div className="flex min-h-[150px] flex-col justify-between rounded bg-white p-4">
        <div>
          <span className="text-2xl font-bold">{passData.passName}</span>
        </div>
        <div>
          <span>${passData.cost} / month</span>
        </div>
      </div>
    )
}
