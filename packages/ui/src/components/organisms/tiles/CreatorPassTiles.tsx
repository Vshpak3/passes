import { PassDto } from "@passes/api-client"
import classNames from "classnames"
import React, { useEffect, useState } from "react"

import CreatorPassModal from "../CreatorPassModal"

interface ICreatorPassTiles {
  passData: PassDto
  alternateBg?: boolean
}

const CreatorPassTiles = ({
  passData,
  alternateBg = false
}: ICreatorPassTiles) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleClick = () => {
    setModalOpen(true)
  }
  if (!hasMounted) {
    return null
  } else {
    return (
      <>
        <div
          className={classNames(
            alternateBg
              ? "bg-gradient-to-r from-passes-blue-100 to-[#e292b3]"
              : "bg-gradient-to-r from-[#a159d3] to-passes-blue-100",
            "col-span-1 min-h-[213px] min-w-[260px] max-w-[260px] cursor-pointer rounded-lg  p-4 drop-shadow transition-colors"
          )}
          onClick={handleClick}
        >
          <div className="grid h-full grid-flow-row gap-6 p-2">
            <div className="row-span-1 flex h-[55px] items-start justify-start">
              <span className="text-2xl font-bold text-[#ffff]/90">
                {passData.title}
              </span>
            </div>
            <div className="row-span-1 flex items-start justify-start text-lg text-[#ffff]/90">
              <span className="font-bold">{passData.price}.00</span>
              <span className="ml-2 font-light">/month</span>
            </div>
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
}

export default CreatorPassTiles
