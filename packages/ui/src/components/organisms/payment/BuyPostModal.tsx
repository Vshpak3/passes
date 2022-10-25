import {
  GetPayinMethodResponseDtoMethodEnum,
  PostDto
} from "@passes/api-client"
import WalletIcon from "public/icons/wallet.svg"
import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/Button"
import { BuyPostButton } from "src/components/molecules/payment/BuyPostButton"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { Modal } from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { getWhiteListedPasses } from "src/helpers/getWhiteListedPasses"
import { plural } from "src/helpers/plural"
import { useExternalPasses } from "src/hooks/passes/useExternalPasses"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface BuyPostModalProps {
  post: PostDto | null
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

const BuyPostModal: FC<BuyPostModalProps> = ({ post, setPost }) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()
  const { externalPasses } = useExternalPasses()
  const whitePasessList = getWhiteListedPasses(externalPasses, post?.passIds)
  const { images, video } = contentTypeCounter(post?.contents)

  const onSuccessHandler = () => {
    setPost(null)
  }

  return (
    <Modal isOpen={true} setOpen={() => setPost(null)}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy Post
        </span>
        <span className="text-white">${post?.price?.toFixed(2) ?? "0.00"}</span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">
            {!!video && `${video} videos`} {!!images && plural("photo", images)}
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
        {!!whitePasessList?.length && (
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
        postId={post?.postId || ""}
        onSuccess={onSuccessHandler}
      />
    </Modal>
  )
}

export default BuyPostModal // eslint-disable-line import/no-default-export
