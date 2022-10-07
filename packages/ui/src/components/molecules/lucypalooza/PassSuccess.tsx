import { PassHolderDto } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { FC } from "react"
import { Button, GradientBorderTile } from "src/components/atoms"
import { ContentService } from "src/helpers"

interface IPassSuccess {
  pass: PassHolderDto
}

const PassSuccess: FC<IPassSuccess> = ({ pass }) => {
  const { passId, address, tokenId, title } = pass ?? {}
  const router = useRouter()

  return (
    <div className="mx-auto mt-[93px] flex max-w-[960px] items-center justify-between space-x-[93px]">
      <div className="flex flex-col items-center space-y-9 text-center">
        <h4 className="text-2xl font-bold leading-[25px]">
          Your {title} Was Purchased Successfully!
        </h4>
        <p className="text-[17px] leading-[22px]">
          Thank you! We will see you at Lucypalooza on Wednesday, October 12.
          You can also see your NFT on EtherScan.
        </p>
        <div className="w-full px-[19px]">
          <Button
            tag="a"
            variant="purple-light"
            className="w-full"
            onClick={() => {
              if (tokenId) {
                router.push(
                  "https://etherscan.io/nft/" +
                    address +
                    "/" +
                    parseInt(tokenId, 16).toString()
                )
              }
            }}
          >
            View on EtherScan
          </Button>
        </div>
      </div>
      <GradientBorderTile
        className="!h-[415px] !w-[415px] flex-shrink-0 !rounded-[20px]"
        innerClass="!rounded-[20px] overflow-hidden"
      >
        {passId && (
          <video autoPlay loop muted>
            <source
              src={passId && ContentService.passVideo(passId)}
              type="video/mp4"
            />
          </video>
        )}
      </GradientBorderTile>
    </div>
  )
}

export default PassSuccess
