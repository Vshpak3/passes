import { GetPassesDto } from "@passes/api-client"
import React from "react"

import Carousel from "./Carousel"
import { Pass } from "./PassesComponents"
interface IPasses {
  creatorPasses: GetPassesDto | undefined
}

const Passes = ({ creatorPasses }: IPasses) => (
  <div className="flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px]  md:items-center ">
    <span className="text-base font-bold text-[#ffff]/90 lg:self-start">
      Pass Types
    </span>
    <div>
      <div className="lg:overflow-x-none hidden gap-3 lg:mx-0 lg:flex lg:flex-col lg:items-start lg:divide-y lg:divide-[#322E33]">
        {creatorPasses?.passes.map((pass, index) => (
          <Pass key={index} pass={pass} />
        ))}
      </div>
      <div className="-ml-[12px] -mr-[12px] lg:hidden">
        {creatorPasses && <Carousel passes={creatorPasses.passes} />}
      </div>
    </div>
  </div>
)

export default Passes
