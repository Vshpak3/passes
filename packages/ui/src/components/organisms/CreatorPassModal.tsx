import { GetPassDto } from "@passes/api-client"
import Image from "next/image"
import React, { Dispatch, SetStateAction } from "react"
import { Button } from "src/components/atoms"

import Modal from "./Modal"

interface ICreatorPassModal {
  isOpen: any
  setOpen: Dispatch<SetStateAction<any>>
  passData: GetPassDto
}

const CreatorPassModal = ({
  isOpen = null,
  setOpen,
  passData
}: ICreatorPassModal) => {
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="flex flex-wrap gap-4">
        <Image src={passData.imageUrl} alt="test" width={200} height={200} />
        <div className="flex flex-grow flex-col">
          <div>
            <span className="text-[#ffff]/90">{passData.title}</span>
          </div>
          <div>
            {/* <span className="text-[#ffff]/70">{passData.handle}</span> */}
          </div>
        </div>
        <Button variant="white" className="rounded">
          View Receipt
        </Button>
        <div className="h-0 basis-full"></div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Purchase Date</span>
            {/* <span className="text-[#ffff]/90">{passData.purchaseDate}</span> */}
          </div>
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Last Renewal</span>
            {/* <span className="text-[#ffff]/90">{passData.lastRenewal}</span> */}
          </div>
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Price</span>
            <span className="text-[#ffff]/90">{passData.price}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[#ffff]/90">About This Pass</span>
          {/* <span className="text-[#ffff]/90">{passData.tagline}</span> */}
          <span className="text-[#ffff]/90">{passData.description}</span>
        </div>
      </div>
    </Modal>
  )
}

export default CreatorPassModal
