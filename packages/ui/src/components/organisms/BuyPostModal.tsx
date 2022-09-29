import {
  GetPayinMethodResponseDtoMethodEnum,
  GetPostResponseDto
} from "@passes/api-client"
import { useRouter } from "next/router"
import WalletIcon from "public/icons/wallet.svg"
import React, { Dispatch, SetStateAction } from "react"
import { Button } from "src/components/atoms"
import Modal from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { getWhiteListedPasses } from "src/helpers/getWhiteListedPasses"
import { paymentMethodConfig } from "src/helpers/payment/paymentMethodConfig"
import { usePasses, usePayment } from "src/hooks"

import { BuyPostButton } from "../payment/buy-post"

interface IBuyPostModal {
  postInfo: GetPostResponseDto | null
  setOpen: Dispatch<SetStateAction<GetPostResponseDto | null>>
  isOpen?: boolean
}

const BuyPostModal = ({ postInfo, setOpen, isOpen }: IBuyPostModal) => {
  const router = useRouter()
  const { defaultPayinMethod, cardInfo } = usePayment()
  const { externalPasses } = usePasses()

  const whitePasessList = getWhiteListedPasses(
    externalPasses,
    postInfo?.passIds
  )

  const { images, video } = contentTypeCounter(postInfo?.content)

  return (
    <Modal isOpen={Boolean(postInfo) || isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy Post
        </span>
        <span className="text-white">
          ${postInfo?.price?.toFixed(2) ?? 100}
        </span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">
            {!!video && `${video} videos`} {!!images && `${images} photos`}
          </span>
        </div>
        <div>
          <span className="text-[#ffff]/90">
            This content will be unlocked and available in the feed after
            purchase.
          </span>
        </div>
        {defaultPayinMethod &&
          paymentMethodConfig(defaultPayinMethod.method, cardInfo)}
        <div className="my-4">
          <span className="text-[#ffff]/90">
            Want to update your default payment method or add a new one?
          </span>{" "}
          <span
            className="cursor-pointer text-[#ffff]/90 underline"
            onClick={() => router.push("/payment/default-payin-method")}
          >
            Settings
          </span>
        </div>
        {whitePasessList && !!whitePasessList.length && (
          <div>
            <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
              or <br />
              <span className="my-[12px] block">Verify Whitelisted NFT</span>
            </span>
            <div>
              <Button variant="purple">
                <WalletIcon />
                Verify your NFT
              </Button>
            </div>
          </div>
        )}
      </div>
      <BuyPostButton
        isDisabled={
          defaultPayinMethod &&
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        postId={postInfo?.postId as string}
        fromDM={false}
        payinMethod={defaultPayinMethod}
        onSuccess={() => setOpen(null)}
      />
    </Modal>
  )
}

export default BuyPostModal
