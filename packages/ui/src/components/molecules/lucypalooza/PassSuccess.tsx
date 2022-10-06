import React from "react"
import { Button, GradientBorderTile } from "src/components/atoms"

const PassSuccess = () => {
  return (
    <div className="mx-auto mt-[93px] flex max-w-[960px] items-center justify-between space-x-[93px]">
      <div className="flex flex-col items-center space-y-9 text-center">
        <h4 className="text-2xl font-bold leading-[25px]">
          Your Pass Was Purchased Successfully!
        </h4>
        <p className="text-[17px] leading-[22px]">
          Thank you! We will see you at Lucypalooza on Wednesday, October 12.
          Check your e-mail for the confirmation letter and detailes on your
          purchase. You can also see your NFT on secondary market - OpenSea.
        </p>
        <div className="w-full px-[19px]">
          <Button tag="button" variant="purple-light" className="w-full">
            View on OpenSea
          </Button>
        </div>
      </div>
      <GradientBorderTile
        className="!h-[415px] !w-[415px] flex-shrink-0 !rounded-[20px]"
        innerClass="!rounded-[20px] overflow-hidden"
      >
        <img
          src="/img/lucyplooza/vip-pass.png"
          alt="vip pass card"
          className="h-full w-full object-cover object-center"
        />
      </GradientBorderTile>
    </div>
  )
}

export default PassSuccess
