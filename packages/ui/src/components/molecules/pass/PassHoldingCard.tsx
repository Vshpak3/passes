import { PassHolderDto, PassHolderDtoChainEnum } from "@passes/api-client"
import Link from "next/link"
import EthereumIcon from "public/icons/eth.svg"
import SolanaIcon from "public/icons/sol.svg"
import { FC } from "react"

import { PassMedia } from "src/components/atoms/passes/PassMedia"

interface PassHoldingCardProps {
  passHolder: PassHolderDto
}

// export const PassRenewalButton: FC<PassRenewalButtonProps> = ({
//   onRenewal
// }) => (
//   <button
//     className="flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-passes-pink-100 py-[10px] text-base font-semibold text-white shadow-sm"
//     value="renew-pass"
//     onClick={onRenewal}
//   >
//     <UnlockLockIcon className="flex h-6 w-6" />
//     Renew
//   </button>
// )

export const PassHoldingCard: FC<PassHoldingCardProps> = ({ passHolder }) => {
  // const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  // const now = Date.now()

  // const toggleRenewModal = () => setIsRenewModalOpen((prevState) => !prevState)
  return (
    <div className="col-span-1 w-full min-w-[400px] max-w-[400px] rounded rounded-[15px] border border-[#2C282D] py-[24px] px-[16px]">
      <div className="aspect-[1/1] w-full rounded-[15px]">
        <PassMedia
          passId={passHolder.passId}
          imageType={passHolder.imageType}
          animationType={passHolder.animationType}
        />
      </div>
      <div className=" grow cursor-pointer rounded-xl drop-shadow transition-colors">
        <div className="flex h-full flex-col items-start justify-between pt-[20px] text-[#ffff]/90">
          <div className="align-items flex w-full flex-row items-center justify-between">
            <div className="text-[18px] font-[700]">{passHolder.title}</div>
            <div className="flex flex-row gap-[5px] text-[18px] font-[700]">
              {passHolder.chain === PassHolderDtoChainEnum.Eth ? (
                <>
                  <EthereumIcon /> Ethereum
                </>
              ) : (
                passHolder.chain === PassHolderDtoChainEnum.Sol && (
                  <>
                    <SolanaIcon /> Solana
                  </>
                )
              )}
            </div>
          </div>
          <div className="border-b border-b-[#2C282D] py-[12px]">
            <span className="w-full text-[12px] font-bold text-[#ffffff76]">
              {passHolder.description}
            </span>
          </div>
          {passHolder.totalMessages !== null && passHolder.totalMessages > 0 && (
            <div className="mt-[12px]">
              <span className="ml-2 text-[14px] font-light">
                {passHolder.messages} / {passHolder.totalMessages} free messages
                left
              </span>
            </div>
          )}
          {passHolder.totalMessages === null && (
            <div className="mt-[12px]">
              <span className="ml-2 text-[14px] font-light">
                Unlimited free messages
              </span>
            </div>
          )}
          <div className="mt-[12px] w-full">
            {passHolder.chain === PassHolderDtoChainEnum.Eth ? (
              <Link
                href={
                  "https://etherscan.io/nft/" +
                  passHolder.address +
                  "/" +
                  parseInt(passHolder.tokenId ?? "0x0", 16).toString()
                }
              >
                <button className="w-full rounded-[50px] bg-[#9C4DC1] py-[10px] px-[33px] !text-[18px] font-bold">
                  View on EtherScan
                </button>
              </Link>
            ) : (
              passHolder.chain === PassHolderDtoChainEnum.Sol && (
                <Link href={"https://solscan.io/token/" + passHolder.address}>
                  <button className="w-full rounded-[50px] bg-[#9C4DC1] py-[10px] px-[33px] !text-[18px] font-bold">
                    View on SolanaScan
                  </button>
                </Link>
              )
            )}
          </div>
          {!!passHolder.expiresAt && (
            <div className="mt-[12px] w-full">
              <span className="text-[#767676]">
                {passHolder.expiresAt < new Date() ? "Expired" : "Expires"} on
                {passHolder.expiresAt.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
