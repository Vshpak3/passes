import { PassHolderDto, PassHolderDtoChainEnum } from "@passes/api-client"
import Link from "next/link"
import InfoIcon from "public/icons/square-info-icon.svg"
import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { formatText } from "src/helpers/formatters"

interface PassHoldingCardProps {
  passHolder: PassHolderDto
}

export const PassHoldingCard: FC<PassHoldingCardProps> = ({ passHolder }) => {
  return (
    <div className="col-span-1 box-border flex w-full min-w-[300px] max-w-[300px] flex-col justify-between rounded py-[24px] px-[16px]">
      <div className="max-w-[374px] rounded-[15px]">
        <PassMedia
          animationType={passHolder.animationType}
          imageType={passHolder.imageType}
          passId={passHolder.passId}
        />
      </div>
      <div className="h-full w-full">
        <div className="flex min-h-[300px] grow flex-col justify-between rounded-xl drop-shadow transition-colors">
          <div className="flex h-full flex-col items-start justify-between pt-[20px] text-[#ffff]/90">
            <div className="flex w-full flex-row items-center justify-between">
              <div className="text-[16px] font-[700]">{passHolder.title}</div>
            </div>
            <div className="mt-[9px] w-full border-y border-y-[#2C282D] py-[12px]">
              <span className="w-full whitespace-pre-wrap text-[12px] font-bold text-[#ffffff76]">
                {formatText(passHolder.description)}
              </span>
            </div>
            {passHolder.totalMessages !== null && passHolder.totalMessages > 0 && (
              <div className="mt-[12px]">
                <span className="text-[12px] font-normal text-[#767676]">
                  <span className="text-[14px] font-medium text-white">
                    {passHolder.messages}
                  </span>{" "}
                  free messages left
                </span>
              </div>
            )}
            {passHolder.totalMessages === null && (
              <div className="mt-[12px]">
                <span className="text-[12px] font-normal text-[#767676]">
                  <span className="text-[14px] font-medium text-white">
                    Unlimited
                  </span>{" "}
                  free messages
                </span>
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="mt-[12px] w-full text-[16px]">
              {passHolder.chain === PassHolderDtoChainEnum.Eth ? (
                <Link
                  href={
                    "https://etherscan.io/nft/" +
                    passHolder.address +
                    "/" +
                    parseInt(passHolder.tokenId ?? "0x0", 16).toString()
                  }
                >
                  <Button className="h-[44px] w-full rounded-full py-2 text-center">
                    View on Etherscan
                  </Button>
                </Link>
              ) : (
                passHolder.chain === PassHolderDtoChainEnum.Sol && (
                  <Link href={"https://solscan.io/token/" + passHolder.address}>
                    <Button className="h-[44px] w-full rounded-full py-[10px] text-center">
                      View on SolanaScan
                    </Button>
                  </Link>
                )
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="mt-[12px] w-full">
                {!!passHolder.expiresAt && (
                  <span className="text-[#767676]">
                    {passHolder.expiresAt < new Date()
                      ? "Expired on "
                      : "Expires "}
                    {passHolder.expiresAt.toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="mt-[12px]">
                <IconTooltip
                  icon={InfoIcon}
                  position="top"
                  tooltipClassName="w-[80px] text-center"
                  tooltipText={
                    <>
                      {/* Chain: */}
                      {passHolder.chain === PassHolderDtoChainEnum.Sol
                        ? " Solana"
                        : " Ethereum"}
                      {/* <br />
                      <br />
                      {passHolder.chain === PassHolderDtoChainEnum.Sol && (
                        <>
                          Collection Address: {passHolder.collectionAddress}
                          <br />
                          <br />
                        </>
                      )}
                      Pass Adddres: {passHolder.address}
                      {passHolder.tokenId && (
                        <>
                          <br /> <br />
                          TokenId: {parseInt(passHolder.tokenId, 16)} <br />
                        </>
                      )} */}
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
