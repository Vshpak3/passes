import { PayinMethodDto, PostDto } from "@passes/api-client"
import WalletIcon from "public/icons/wallet.svg"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { BuyPostButton } from "src/components/molecules/payment/BuyPostButton"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Dialog } from "src/components/organisms/Dialog"
import { UnlockText } from "src/components/organisms/UnlockText"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"
import { getWhiteListedPasses } from "src/helpers/getWhiteListedPasses"
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
  const [newCard, setNewCard] = useState<boolean>(false)

  const onSuccessHandler = () => {
    setPost(null)
  }

  const { displayName, userId, username, price, postId } = post

  return (
    <Dialog
      className="flex w-[600px] max-w-full flex-col items-center justify-center rounded-[5px] border border-white/10 bg-passes-black px-6 py-5 transition-all"
      onClose={() => setPost(null)}
      open
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <PaymentModalHeader
            title="Buy Post"
            user={{ userId, username, displayName }}
          />
          <div>
            <div className="my-4 flex justify-between">
              <span className="flex items-center rounded border border-passes-gray-600 px-2 py-1 text-white">
                <UnlockText images={images} showUnlock={false} videos={video} />
              </span>
              <span className="flex items-center text-white">
                Unlock for
                <span className="ml-3 flex items-center rounded bg-passes-primary-color/30 py-2 px-3 font-bold">
                  {formatCurrency(post.price ?? 0)}
                </span>
              </span>
            </div>
            <span className="my-4 flex text-passes-dark-gray">
              This content will be unlocked and available in the feed after
              purchase.
            </span>
            {!!whitePasessList?.length && (
              <div>
                <span className="mt-[12px] block text-[16px] font-bold text-white/90">
                  or <br />
                  <span className="my-[12px] block">
                    Verify Whitelisted NFT
                  </span>
                </span>
                <div>
                  <Button>
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
            setNewCard={setNewCard}
            setPayinMethod={setPayinMethod}
          />
          <PaymentModalFooter onClose={() => setPost(null)}>
            <BuyPostButton
              onSuccess={onSuccessHandler}
              payinMethod={payinMethod}
              postId={postId || ""}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}

export default BuyPostModal // eslint-disable-line import/no-default-export
