import { PassDto } from "@passes/api-client"
import React, { useState } from "react"
import { QuickPayModal } from "src/components/organisms"

import Carousel from "./Carousel"
import { Pass } from "./PassesComponents"
interface IPasses {
  creatorPasses: PassDto[] | undefined
}

export interface PaymentModalInfo {
  id: string
  price: number
  title: string
}

const Passes = ({ creatorPasses }: IPasses) => {
  const [isModalOpen, setModalOpen] = useState<PaymentModalInfo | null>(null)

  return (
    <>
      <div className="flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px]  md:items-center ">
        <span className="text-base font-bold text-[#ffff]/90 lg:self-start">
          Pass Types
        </span>
        <div>
          <div className="lg:overflow-x-none relative hidden gap-3 lg:mx-0 lg:flex lg:flex-col lg:items-start lg:divide-y lg:divide-[#322E33]">
            {creatorPasses?.map((pass, index) => (
              <Pass key={index} pass={pass} setModalOpen={setModalOpen} />
            ))}
          </div>
          <div className="-ml-[12px] -mr-[12px] lg:hidden">
            {creatorPasses && (
              <Carousel passes={creatorPasses} setModalOpen={setModalOpen} />
            )}
          </div>
        </div>
      </div>
      <QuickPayModal isOpen={isModalOpen} setOpen={setModalOpen} />
    </>
  )
}

export default Passes
