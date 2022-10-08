import dynamic from "next/dynamic"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
import { PostPaymentProps } from "src/components/organisms/payment/PaymentProps"
import { formatCurrency } from "src/helpers"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { plural } from "src/helpers/plural"

const BuyPostModal = dynamic(
  () => import("src/components/organisms/payment/BuyPostModal"),
  { ssr: false }
)

interface LockedMedia extends PostPaymentProps {
  setPostUnlocked: Dispatch<SetStateAction<boolean>>
  showcaseImg: string | null
}

export const LockedMedia: FC<LockedMedia> = ({
  cards,
  defaultPayinMethod,
  post,
  setIsPayed,
  showcaseImg
}) => {
  const [openBuyPostModal, setOpenBuyPostModal] = useState<boolean>(false)
  const { images, video } = contentTypeCounter(post.content)

  return (
    <>
      <div className="relative mt-3 min-h-[200px] p-16">
        {showcaseImg && (
          <div className="[filter:blur(15px)]">
            <img
              src={showcaseImg}
              alt="post"
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-[35px] rounded-[20px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px]">
          <PostUnlockButton
            onClick={() => setOpenBuyPostModal(true)}
            name={`Unlock Post For ${formatCurrency(post.price ?? 0)}`}
            className="w-auto !px-[30px] !py-2.5"
          />
          <p className="mt-[17px] text-base font-medium">
            <span>Unlock {video ? "1 video" : plural("photo", images)}!</span>
          </p>
        </div>
      </div>
      <BuyPostModal
        cards={cards}
        defaultPayinMethod={defaultPayinMethod}
        isOpen={openBuyPostModal}
        post={post}
        setIsPayed={setIsPayed}
        setOpen={setOpenBuyPostModal}
      />
    </>
  )
}
