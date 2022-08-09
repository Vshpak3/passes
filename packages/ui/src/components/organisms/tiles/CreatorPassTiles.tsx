import React, { useEffect, useState } from "react"

import CreatorPassModal from "../CreatorPassModal"

interface ICreatorPassTiles {
  passData: {
    passName: string
    creatorName: string
    handle: string
    cost: string
    imgUrl: string
    purchaseDate: string
    lastRenewal: string
    tagline: string
    description: string
  }
}

const CreatorPassTiles = ({ passData }: ICreatorPassTiles) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  console.log("tiles", passData)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleClick = () => {
    setModalOpen(true)
  }
  if (!hasMounted) {
    return null
  } else
    return (
      <>
        <div
          className="min-h-[213px] min-w-[260px] rounded bg-white p-4 "
          style={{
            backgroundImage: `url(${passData.imgUrl})`,
            backgroundSize: "cover"
          }}
          onClick={handleClick}
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
        <CreatorPassModal
          isOpen={isModalOpen}
          setOpen={setModalOpen}
          passData={passData}
        />
      </>
    )
}

export default CreatorPassTiles
