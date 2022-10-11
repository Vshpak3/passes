import { PassDto } from "@passes/api-client"
import Image from "next/image"
import React, { Dispatch, FC, SetStateAction } from "react"
import { Button } from "src/components/atoms/Button"

import { Modal } from "./Modal"

interface CreatorPassModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  passData: PassDto
  imageUrl?: string
}

export const CreatorPassModal: FC<CreatorPassModalProps> = ({
  isOpen = false,
  setOpen,
  passData: { title, price, description },
  imageUrl
}) => {
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="flex flex-wrap gap-4">
        {imageUrl && (
          <Image src={imageUrl} alt="test" width={200} height={200} />
        )}
        <div className="flex flex-grow flex-col">
          <div>
            <span className="text-[#ffff]/90">{title}</span>
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
            <span className="text-[#ffff]/90">{price}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[#ffff]/90">About This Pass</span>
          {/* <span className="text-[#ffff]/90">{passData.tagline}</span> */}
          <span className="text-[#ffff]/90">{description}</span>
        </div>
      </div>
    </Modal>
  )
}
