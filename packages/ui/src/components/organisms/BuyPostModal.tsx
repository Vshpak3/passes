import { useRouter } from "next/router"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import { Dispatch, SetStateAction } from "react"
import Modal from "src/components/organisms/Modal"
import { creditCardIcons } from "src/helpers/creditCardIcon"
import { usePayment } from "src/hooks"

import { PaymentModalInfo } from "../pages/profile/passes/PassTypes"
import { BuyPostButton } from "../payment/buy-post"

interface IBuyPostModal {
  isOpen: PaymentModalInfo | null
  setOpen: Dispatch<SetStateAction<PaymentModalInfo | null>>
  paymentMethod: "crypto" | "fiat"
}

const BuyPostModal = ({
  isOpen = null,
  setOpen,
  paymentMethod = "crypto"
}: IBuyPostModal) => {
  const router = useRouter()
  const { defaultPayinMethod } = usePayment()

  const paymentInfo = (
    <div className="flex justify-evenly rounded border border-passes-dark-200 bg-[#100C11] p-2 text-left text-[#ffff]/90">
      {paymentMethod === "crypto" ? (
        <>
          <div className="flex flex-1 items-center gap-4 justify-self-start">
            <MetamaskIcon width="30" height="30" />
            <span>Metamask MATIC USDC</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-4 justify-self-start">
            {creditCardIcons["mastercard"]}
            <span>• • • • ‏‏‎5678</span>
          </div>
          <div className="flex-1">
            <span>05/2027</span>
          </div>
        </>
      )}
      {/* fake info here, needs to grab user default CC data to fill this out automatically */}
    </div>
  )

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy Post
        </span>
        <span className="text-white">${isOpen?.price?.toFixed(2) ?? 100}</span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">4 videos, 10 photos</span>
        </div>
        <div>
          <span className="text-[#ffff]/90">
            This content will be unlocked and available in the feed after
            purchase.
          </span>
        </div>
        <div className="my-4">
          <span className="font-bold text-[#ffff]/90">
            Pay with {paymentMethod === "crypto" ? "Crypto" : "Credit Card"}
          </span>
        </div>
        {paymentInfo}
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
        {isOpen && (
          <BuyPostButton
            postId={isOpen?.passId as string}
            fromDM={false}
            payinMethod={defaultPayinMethod}
            onSuccess={() => setOpen(null)}
          />
        )}
      </div>
    </Modal>
  )
}

export default BuyPostModal
