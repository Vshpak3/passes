import { PassDto } from "@passes/api-client"
import React, { useEffect, useState } from "react"

import CreatorPassModal from "../CreatorPassModal"

interface ICreatorPassTiles {
  passData: PassDto
}

const CreatorPassTiles = ({ passData }: ICreatorPassTiles) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleClick = () => {
    setModalOpen(true)
  }
  console.log(passData)
  if (!hasMounted) {
    return null
  } else
    return (
      <>
        <div
          className="min-h-[213px] min-w-[260px] max-w-[260px] rounded-lg bg-white p-4 "
          style={{
            backgroundImage: `url(${passData.imageUrl})`,
            backgroundSize: "cover"
          }}
          onClick={handleClick}
        >
          <div>
            <span className="text-2xl font-bold text-[#ffff]/90">
              {passData.title}
            </span>
          </div>
          <div>
            <span className="text-[#ffff]/90">${passData.price} / month</span>
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
