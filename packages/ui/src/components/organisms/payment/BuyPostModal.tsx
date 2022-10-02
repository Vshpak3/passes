import {
  GetPayinMethodResponseDtoMethodEnum,
  PostDto
} from "@passes/api-client"
import WalletIcon from "public/icons/wallet.svg"
import React, { Dispatch, SetStateAction } from "react"
import { Button } from "src/components/atoms"
import { BuyPostButton } from "src/components/molecules/payment/buy-post-button"
import PayinMethodDisplay from "src/components/molecules/payment/payin-method"
import Modal from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { getWhiteListedPasses } from "src/helpers/getWhiteListedPasses"
import { usePasses, usePayinMethod } from "src/hooks"

interface IBuyPostModal {
  post: PostDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const BuyPostModal = ({ post, setOpen, isOpen }: IBuyPostModal) => {
  const { defaultPayinMethod, cards } = usePayinMethod()
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )
  const { externalPasses } = usePasses()

  const whitePasessList = getWhiteListedPasses(externalPasses, post?.passIds)

  const { images, video } = contentTypeCounter(post.content)

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy Post
        </span>
        <span className="text-white">${post.price?.toFixed(2) ?? "0.00"}</span>
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
        {defaultPayinMethod && (
          <PayinMethodDisplay
            payinMethod={defaultPayinMethod}
            card={defaultCard}
          />
        )}
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
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        postId={post.postId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  )
}

export default BuyPostModal
