import Image from "next/image"
import React, { Dispatch, SetStateAction } from "react"

import { Button } from "../atoms"
import Modal from "./Modal"

interface ICreatorPassModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  passData: {
    passName: string
    creatorName: string
    handle: string
    cost: string
    imgUrl: string
    purchaseDate: string
    lastRenewal: string
    description: string
    tagline: string
  }
}

const CreatorPassModal = ({
  isOpen = false,
  setOpen,
  passData
}: ICreatorPassModal) => {
  console.log("from modal", passData)
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="flex flex-wrap gap-4">
        <Image src={passData.imgUrl} alt="test" width={200} height={200} />
        <div className="flex flex-grow flex-col">
          <div>
            <span className="text-[#ffff]/90">{passData.passName}</span>
          </div>
          <div>
            <span className="text-[#ffff]/70">{passData.handle}</span>
          </div>
        </div>
        <Button variant="white" className="rounded">
          View Receipt
        </Button>
        {/* <div className="h-0 basis-full"></div> */}
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Purchase Date</span>
            <span className="text-[#ffff]/90">{passData.purchaseDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Last Renewal</span>
            <span className="text-[#ffff]/90">{passData.lastRenewal}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Price</span>
            <span className="text-[#ffff]/90">{passData.cost}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[#ffff]/90">About This Pass</span>
          <span className="text-[#ffff]/90">{passData.tagline}</span>
          <span className="text-[#ffff]/90">{passData.description}</span>
        </div>
      </div>
    </Modal>
  )
}

export default CreatorPassModal
