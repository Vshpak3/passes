import { PayinMethodDto, PostDto } from "@passes/api-client"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import WalletIcon from "public/icons/wallet.svg"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { BuyPostButton } from "src/components/molecules/payment/BuyPostButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { Modal } from "src/components/organisms/Modal"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { getWhiteListedPasses } from "src/helpers/getWhiteListedPasses"
import { plural } from "src/helpers/plural"
import { useExternalPasses } from "src/hooks/passes/useExternalPasses"

interface BuyPostModalProps {
  post: PostDto
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

const BuyPostModal: FC<BuyPostModalProps> = ({ post, setPost }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const { externalPasses } = useExternalPasses()
  const whitePasessList = getWhiteListedPasses(externalPasses, post?.passIds)
  const { images, video } = contentTypeCounter(post?.contents)

  const onSuccessHandler = () => {
    setPost(null)
  }

  const { displayName, userId, username, price, postId } = post

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setPost(null)}
    >
      <SectionTitle>Buy Post</SectionTitle>
      <div className="flex items-center border-b border-passes-gray-600 pt-2 pb-6">
        <ProfileImage type="thumbnail" userId={userId} />
        <div className="ml-4 flex flex-col">
          <span>{displayName}</span>
          <span className="text-passes-dark-gray">@{username}</span>
        </div>
      </div>
      <div>
        <div className="my-4 flex justify-between">
          <span className="flex items-center rounded border border-passes-gray-600 px-2 py-1 text-white">
            {Boolean(video) && `${video} videos`}{" "}
            {Boolean(images) && plural("photo", images)}
          </span>
          <span className="flex items-center text-white">
            Unlock for
            <span className="ml-2 flex items-center rounded bg-passes-primary-color/30 p-2 font-bold">
              <DollarIcon />
              <span className="ml-1">${price?.toFixed(2)}</span>
            </span>
          </span>
        </div>
        <span className="my-4 flex text-passes-dark-gray">
          This content will be unlocked and available in the feed after
          purchase.
        </span>
        {!!whitePasessList?.length && (
          <div>
            <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
              or <br />
              <span className="my-[12px] block">Verify Whitelisted NFT</span>
            </span>
            <div>
              <Button variant="pink">
                <WalletIcon />
                Verify your NFT
              </Button>
            </div>
          </div>
        )}
      </div>
      <PaymentModalBody
        closeModal={() => setPost(null)}
        price={price ?? 0}
        setPayinMethod={setPayinMethod}
      />
      <div className="flex w-full items-center justify-end">
        <Button
          className="mr-8 font-bold text-passes-primary-color"
          onClick={() => setPost(null)}
        >
          Cancel
        </Button>
        <BuyPostButton
          onSuccess={onSuccessHandler}
          payinMethod={payinMethod}
          postId={postId || ""}
        />
      </div>
    </Modal>
  )
}

export default BuyPostModal // eslint-disable-line import/no-default-export
