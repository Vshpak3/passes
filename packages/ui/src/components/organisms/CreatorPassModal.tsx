import { PassDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"

import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { formatText } from "src/helpers/formatters"
import { Modal } from "./Modal"

interface CreatorPassModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  pass: PassDto
}

export const CreatorPassModal: FC<CreatorPassModalProps> = ({
  isOpen = false,
  setOpen,
  pass
}) => {
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-grow flex-col">
          <div>
            <span className="text-[#ffff]/90">{formatText(pass.title)}</span>
          </div>
        </div>
        <PassMedia
          passId={pass.passId}
          imageType={pass.imageType}
          animationType={pass.animationType}
        />
        <div className="h-0 basis-full"></div>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <span className="text-[#ffff]/70">Price</span>
            <span className="text-[#ffff]/90">{pass.price}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[#ffff]/90">About This Pass</span>
          <span className="text-[#ffff]/90">{pass.description}</span>
        </div>
      </div>
    </Modal>
  )
}
